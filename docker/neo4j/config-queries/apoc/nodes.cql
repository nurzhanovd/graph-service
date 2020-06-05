CALL apoc.load.json('learning-nodes.json') YIELD value AS node

MERGE (n:Node {uuid: node.uuid})
SET n.title = node.title
