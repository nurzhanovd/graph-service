import { createWriteSession } from 'core/neo4jSession';

const query = `

`;

export const FulfillNode = driver => async (_, { uuid }) => {
  const session = createWriteSession(driver);
  const { records } = await session.run();
  console.log(records[0])
}
