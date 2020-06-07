CALL apoc.load.json("tagNodeRelation.json") yield value

unwind value.uuid as tag
unwind value.nodes as nodes

match (t:Tag {uuid: tag}), (n:Node {uuid: nodes})
merge (t)<-[:RELATED_TO]-(n)


