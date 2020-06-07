call apoc.load.json("tags.json") yield value

MERGE (t:Tag {uuid: value.uuid})
SET t.title = value.title
