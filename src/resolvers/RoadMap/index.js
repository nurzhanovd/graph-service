import {namegen} from 'scripts/seed/seed-mutations';
import {v4 as uuid4} from 'uuid';

// const matchUser = (username) => `MATCH (user: User {username: "${username}"})`;

const createRoadMapRelationship = (username, fromName, toName, fromNodeUuid, toNodeUuid) => `
  MATCH (${fromName}:Node {uuid: "${fromNodeUuid}"})
  MATCH (${toName}:Node {uuid: "${toNodeUuid}")
  CREATE (${fromName})-[:ROADMAP {belongs_to: "${username}"}]->(${toName})`;


const compileAdjacency = (username, relations, iterator) => {
  // const matchUserString = matchUser(username)
  return relations
    .map(rel => createRoadMapRelationship(username, iterator.next().value, iterator.next().value, rel[0], rel[1]))
    .reduce((e1, e2)=>`${e1}${e2}`)
}

const _createRoadMap = () => {
  // console.log('roadMapRelation', roadMapRelation);
  // console.log('nodeRoadMapRelation', nodeRoadMapRelation);
  const relations = [];
  for(let i=0; i<10; i++) {
    relations.push([uuid4(), uuid4()]);
  }

  // const {req} = context;
  // const {username} = req.user;
  const username = "peado";
  console.log("STARTING")
  const iterator = namegen()
  const ca = compileAdjacency(username, relations, iterator)
  console.log(ca)

  return 'work';
}

export const CreateRoadMap = driver => _createRoadMap

_createRoadMap()
