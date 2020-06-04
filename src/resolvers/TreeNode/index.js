import { createReadSession } from 'core/neo4jSession';

const query = `
  match (:Node {uuid: $uuid})-[dep:DEPENDS_ON*0..]->(n:Node)
  with collect(distinct n) as nodes,
  [dep in collect(distinct last(dep)) | {from: startNode(dep).uuid, to:endNode(dep).uuid}] as rels

  return nodes, rels;
`

export const TreeNode = driver => async (_, { uuid }) => {
  if (uuid) {
    const session = createReadSession(driver);
    const { records } = await session.run(query, { uuid });
    const data = records[0].toObject();
    const { rels } = data;
    const nodes = data.nodes.map(n => n.properties);

    return {
      nodes,
      rels,
    }
  }
}
