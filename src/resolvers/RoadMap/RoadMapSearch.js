import { createReadSession } from 'core/neo4jSession';

const showCompleted = `<-[:COMPLETE]-(:User {username: $username})`

export const RoadMapSearch = driver => async (_, { searchString, rootId, searchOnlyCompleted }, {req}) => {
  const { username } = req.user;
  const session = createReadSession(driver);

  const { records } = await session.run(`
    match (:Node { uuid:"${rootId}" })-[:DEPENDS_ON*0..]->(n:Node:Leaf)${searchOnlyCompleted ? showCompleted : ''}
    where n.title =~ ".*${searchString}.*" or n.description =~".*${searchString}.*"
    return n
  `, { username });



  console.log(records.map(n => n.toObject()).map(n => n.n).map(n => n.properties))
  console.log(`
    match (:Node { uuid:"${rootId}" })-[:DEPENDS_ON*0..]->(n:Node:Leaf)${searchOnlyCompleted ? showCompleted : ''}
    where n.title =~ ".*${searchString}.*" or n.description =~".*${searchString}.*"
    return n
  `)
  return [];
}
