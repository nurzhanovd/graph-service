CALL apoc.load.json('learning-nodes-relations.json') YIELD value

UNWIND value.uuid AS root
UNWIND value.childes AS rel

MATCH (r:Node {uuid: root}), (c:Node {uuid: rel})

MERGE (r)-[:DEPENDS_ON]->(c)
