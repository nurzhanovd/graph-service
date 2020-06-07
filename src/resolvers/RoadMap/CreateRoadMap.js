import mock from "./mock";
import { createReadSession } from 'core/neo4jSession';

const createRoadNodesQuery = `
  return $payload;
`;

export const CreateRoadMap = async (_b, _a, {driver}) => {
  const session = createReadSession(driver);
  const { records } = await session.run(`

  `, { kek: mock })
  console.log(records[0].toObject());
  return [];
}
