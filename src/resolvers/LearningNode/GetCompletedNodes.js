import { createReadSession } from 'core/neo4jSession';

const query = `
  match (u:User {username: $username})-[:COMPLETE]->(n:Node)<-[:DEPENDS_ON*0..]-(:Node {title: "Computer Science"})
  with collect(n) as nodes
  return nodes
`


export const GetCompletedNodes = driver => async () => {
  const { run, close } = createReadSession(driver);
  const { records } = await run(query, { username: 'daulet' })
  console.log(records)

  return [];

}
