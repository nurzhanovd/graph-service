CALL apoc.load.json('learning-nodes.json') YIELD value AS node

MERGE (n:Node {uuid: node.uuid})
SET n.title = node.title

FOREACH(ignoreMe IN CASE WHEN node.isLeaf = true THEN [1] ELSE [] END | set n:Leaf)
FOREACH(ignoreMe IN CASE WHEN node.isLeaf = false THEN [1] ELSE [] END | set n:Branch)

