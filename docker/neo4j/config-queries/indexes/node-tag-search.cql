CALL db.index.fulltext.drop('FTSNodeTagTitlesAndDescriptions')

CALL db.index.fulltext.createNodeIndex('FTSNodeTagTitlesAndDescriptions',
['Node', 'Tag'], ['title', 'description'])
RETURN null
