call apoc.load.json("learning-nodes-relations.json") yield value

unwind value.uuid as root
unwind value.childes as rel

match (r:Node { uuid: root }), (c:Node { uuid: rel })

merge (r)-[:DEPENDS_ON]->(c)
