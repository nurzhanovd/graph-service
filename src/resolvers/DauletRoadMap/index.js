import { createReadSession } from 'core/neo4jSession';

export const DauletGetUserRoadMapID = async (a,b, { driver, req } ) => {
  const { username } = req.user;
  const session = createReadSession(driver);
  const { records } = await session.run(`
    MATCH (:User { username: $username })-[:ROADMAP]->(r:RoadMap)
    RETURN r
  `, { username });

  return records.map(n => n.toObject()).map(n => n.r.properties).map(n => n.uuid);
}

