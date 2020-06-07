import {createReadSession} from 'core/neo4jSession';

export const InterestedTag = async (_, {}, { driver, req }) => {
  const session = createReadSession(driver);
  const { username } = req.user;
  const { records } = await session.run(`
    match (:User {username: $username})-[:INTERSTED_IN]->(t:Tag)
    return t
  `, { username });
  session.close();
  return [];
}

export const MergeUserWithTags = async (_, { tags }, { driver, req }) => {
  const session = createReadSession(driver);
  const { username } = req.user;
  console.log(username, tags);
  await session.run(`
    unwind $tags as tag
    match (t:Tag {uuid: tag}), (u:User {username: $username})
    merge (t)<-[:INTERESTED_IN]-(u)
  `, { username, tags });
  session.close();
  return true;
}
