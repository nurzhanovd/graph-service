import { createReadSession } from 'core/neo4jSession';

export const SuggestedRelatedNodes = async (_a, _b, { driver, req }) => {
  const session = createReadSession(driver);
  const { username } = req.user;
  const { records } = await session.run(`
    match (:User {username: $username})-[:INTERESTED_IN]->(:Tag)<-[:RELATED_TO]-(:Leaf)<-[:DEPENDS_ON*0..]-(n:Node {root: true})
    return distinct(n)
  `, { username });
  session.close();

  return records && records.length ? records.map(n => n.toObject()).map((n) => n.n).map(n => n.properties) : [];
}
