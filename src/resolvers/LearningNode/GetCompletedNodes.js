import { createReadSession } from 'core/neo4jSession';

const query = `
  match (u:User {username: $username})-[:COMPLETE]->(n:Node)<-[:DEPENDS_ON*0..]-(:Node {uuid: $nodeId})
  with collect(n) as nodes
  return nodes
`


export const GetCompletedNodes = driver => async (_, { nodeId }, {req}) => {
  const session = createReadSession(driver);
  const { records } = await session.run(query, { username: 'daulet', nodeId })
  session.close();
  return records[0].toObject().nodes.map(n => n.properties);
}
