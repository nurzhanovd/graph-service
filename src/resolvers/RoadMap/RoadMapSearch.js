import { createReadSession } from 'core/neo4jSession';

const query = `
  match (n:Node:Leaf) where n.title =~ ".*Sor.*" or n.description =~".*Sor.*"
`;

export const RoadMapSearch = driver => async (_, { searchString, rootId }) => {
  const session = createReadSession(driver);
  const { records } = await session.run(`
    match (:Node { uuid:"${rootId}" })-[:DEPENDS_ON*0..]->(n:Node:Leaf) where n.title =~ ".*${searchString}.*" or n.description =~".*${searchString}.*"
    return n
  `);

  console.log(`
    match (:Node { uuid:"${rootId}" })-[:DEPENDS_ON*0..]->(n:Node:Leaf) where n.title =~ ".*${searchString}.*" or n.description =~".*${searchString}.*"
    return n
  `)

  return records.map(n => n.toObject()).map(n => n.n).map(n => n.properties);
}
