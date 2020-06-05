import {createWriteSession} from '../../core/neo4jSession';

const searchQuery =
  `CALL db.index.fulltext.queryNodes('FTSNodeTagTitlesAndDescriptions', $searchString)
YIELD node, score
RETURN {uuid:node.uuid, title:node.title,type: labels(node)[0], description: node.description, score:score} AS result
SKIP $offset
LIMIT $limit
`

const rawSearchResultToGQLSearchResult = (records)=>
  records.map(record => record.toObject().result)

export const SearchForNodesAndTags = driver => async (_, {searchString, limit=25, offset=0}) => {
  const session = createWriteSession(driver);
  const {records} = await session.run(
    searchQuery,
    {searchString, limit, offset}
  )
  return rawSearchResultToGQLSearchResult(records)
 }
