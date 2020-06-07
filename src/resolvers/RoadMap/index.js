import {namegen} from 'scripts/seed/seed-mutations';
import {createSession, createWriteSession} from 'core/neo4jSession';

const matchUserQuery = (user, username) =>
  `MATCH (${user}:User {username: "${username}"})`

const matchNodeQuery = (nodeName, uuid) =>
  `MATCH (${nodeName}:Node {uuid: "${uuid}"})`

const createRoadMapQuery = (roadMapName, title, uuid) =>
  `CREATE (${roadMapName}:RoadMap {title: "${title}", uuid: "${uuid}"})`;

const createUserRoadMapRelationshipQuery = (user, roadMapName) =>
  `CREATE (${user})-[:ROADMAP]->(${roadMapName})`

const createNodeRodeMapRelationshipQuery = (roadMapName, username, nodeName) =>
  `CREATE (${roadMapName})-[:CONSISTS_OF {belongs_to: "${username}"}]->(${nodeName})`;

const createRoadMapRoadMapRelationshipQuery = (roadMapName1, username, roadMapName2) =>
  `CREATE (${roadMapName1})-[:HAS {belongs_to: "${username}"}]->(${roadMapName2})`;

const returnInitData = (roadMap, iterator) => {
  const uuidToName = roadMap.map(roadMapElement => [roadMapElement.uuid, iterator.next().value]);
  const [[_0, firstRoadMapName], ..._1] = uuidToName
  const nameToUuid = uuidToName.map(el => [el[1], el[0]]);
  const uuidToNameMap = Object.fromEntries(uuidToName);
  const uuidWithRoadMap = Object.fromEntries(roadMap
    .map(roadMapElement => [roadMapElement.uuid, roadMapElement]));
  const nodeUuidToName = [...(new Set(roadMap
    .flatMap(roadMapElement => roadMapElement.nodes)))]
    .map(nodeUuid => [nodeUuid, iterator.next().value]);
  const nodeUuidToNameMap = Object.fromEntries(nodeUuidToName);
  return {
    firstRoadMapName,
    uuidToName,
    nameToUuid,
    uuidToNameMap,
    uuidWithRoadMap,
    nodeUuidToName,
    nodeUuidToNameMap
  }
}

/**
 *
 * @param driver
 * @return {function(*, {roadMap: Array<{title:string, uuid: string, nodes: Array<String>, next:Array<String>}>}): boolean}
 * @constructor
 */
export const CreateRoadMap = driver => async (_, {roadMap}, context) => {
  const {username} = context.req.user;
  const iterator = namegen();
  const userNodeName = iterator.next().value;
  const {
    firstRoadMapName,
    nameToUuid,
    uuidToNameMap,
    uuidWithRoadMap,
    nodeUuidToName,
    nodeUuidToNameMap
  } = returnInitData(roadMap, iterator);

  const matchedUserQuery = matchUserQuery(userNodeName, username);

  const matchedNodes = nodeUuidToName
    .map(([uuid, name]) => matchNodeQuery(name, uuid))
    .reduce((first, second) => `${first}\n${second}`);

  const createdRoadMapQuery = nameToUuid
    .map(([name, uuid]) =>
      createRoadMapQuery(name, uuidWithRoadMap[uuid].title, uuid))
    .reduce((first, second) => `${first}\n${second}`);

  const createdUserRoadMapRelationshipQuery =
    createUserRoadMapRelationshipQuery(userNodeName, firstRoadMapName);

  const createdRoadMapRoadMapRelationshipQuery = nameToUuid
    .flatMap(([name, uuid]) =>
      (uuidWithRoadMap[uuid].next)
        ? uuidWithRoadMap[uuid].next.map(otherUuid =>
          createRoadMapRoadMapRelationshipQuery(name, username, uuidToNameMap[otherUuid]))
        : '').reduce((first, second) => `${first}\n${second}`);


  const createdNodeRoadMapRelationshipQuery = nameToUuid
    .flatMap(([name, uuid]) =>
      (uuidWithRoadMap[uuid].nodes)
        ? uuidWithRoadMap[uuid].nodes.map(nodeUuid =>
          createNodeRodeMapRelationshipQuery(name, username, nodeUuidToNameMap[nodeUuid]))
        : '').reduce((first, second) => `${first}\n${second}`);

  const query =
    `${matchedUserQuery}
${matchedNodes}
${createdRoadMapQuery}
${createdUserRoadMapRelationshipQuery}
${createdNodeRoadMapRelationshipQuery}
${createdRoadMapRoadMapRelationshipQuery}
`
  const session = createWriteSession(driver);
  await session.run(query)
  session.close()
  return true;
}


const getRoadMapQuery =
// language=Cypher
  (uuid, username) => `
    MATCH rm = (:RoadMap {uuid: '${uuid}'})-[rel:HAS|CONSISTS_OF*0.. {belongs_to: '${username}'}]->(n)
    WITH collect(DISTINCT n) AS nodes,
         [rel IN collect(DISTINCT last(rel)) |{from: startNode(rel).uuid, to: endNode(rel).uuid}]
         AS rels
    RETURN nodes, rels`


const fields = [
  "uuid",
  "root",
  "title",
  "description",
  "content",
  "type"
]

const setNullForUndefined = node => {
  fields.forEach(field=>{
    if(!node.hasOwnProperty(field)) {
      node[field]=null
    }
  });
  return node
}

export const GetRoadMap = driver => async (_, {uuid}, context) => {
  const session = createSession(driver);
  const {username} = context.req.user;
  const query = getRoadMapQuery(uuid, username)
  const {records} = await session.run(query)
  if (records.length) {
    const [first, ..._] = records
    let {nodes, rels} = first.toObject()
    nodes = nodes.map(node=>setNullForUndefined(node.properties))
    return {nodes, rels}
  }
  return null
}
