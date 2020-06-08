import { createWriteSession } from 'core/neo4jSession';

const fulfillQuery = `
  match (u:User { username: $username }), (n:Node { uuid: $uuid })
  merge (u)-[:COMPLETE]->(n)
`;

const isFulfilledQuery = `
  match (u:User { uuid: $userId })-[rel:COMPLETE]-(n:Node { uuid: $nodeId })
  return rel
`;

const NodeToRootPathQuery = `
  match (n:Node {uuid: $nodeId})<-[rels:DEPENDS_ON*0..]-(p:Node)
  return p
`

const neighboursQuery = `
  MATCH (:Node { uuid: $nodeId })<-[:DEPENDS_ON]-(:Node)-[:DEPENDS_ON]->(nodes:Node) return distinct(nodes)
`

export const FulfillNode = driver => async (_, { uuid }, { req }) => {
  const { username } = req.user;
  const session = createWriteSession(driver);
  await session.run(fulfillQuery, { uuid, username });
  session.close();
  return true;
}

export const IsNodeFulFilled = driver => async (_, { userId, nodeId }) => {
  const session = createWriteSession(driver);
  const { records } = await session.run(isFulfilledQuery, { nodeId, userId });
  session.close();

  return Boolean(records.length);
}

export const NodeToRootPath = driver => async (_, { nodeId }) => {
  const session = createWriteSession(driver);
  const { records } = await session.run(NodeToRootPathQuery, { nodeId });
  session.close()
  return records.map(n => n.toObject().p.properties);
}

export const NodeNeighbours = driver => async (_, { nodeId }) => {
  const session = createWriteSession(driver);
  const { records } = await session.run(neighboursQuery, { nodeId });
  session.close();
  return records.map(n => n.toObject()).map(n => n.nodes.properties);
}

