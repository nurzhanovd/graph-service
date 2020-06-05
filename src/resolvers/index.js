import fs from 'fs';
import {FileManager, genFileName} from './file-manager';
import {ApolloClient} from 'apollo-client';
import {driver as Driver} from 'neo4j-driver';
import {SignIn, SignUp} from './Auth';
import {TreeNode} from './TreeNode';
import {FulfillNode,IsNodeFulFilled,NodeToRootPath,NodeNeighbours} from './LearningNode';
import {CreateRoadMap} from './RoadMap';
import {SearchForNodesAndTags} from './Search'

/**
 * @param {Driver} driver
 * @param {ApolloClient}  client
 */
export default (client, driver) => ({
  Query: {
    TreeNode: TreeNode(driver),
    IsNodeFulFilled: IsNodeFulFilled(driver),
    NodeToRootPath: NodeToRootPath(driver),
    NodeNeighbours: NodeNeighbours(driver),
    SearchForNodesAndTags: SearchForNodesAndTags(driver),
  },

  Mutation: {
    async DeleteFileAndRemoveFromDb(parent, {filename}) {
      const path = `public/${filename}`
      if (fs.existsSync(path))
        fs.unlinkSync(path)
      try {
        const fm = new FileManager({filename}, client)
        return (await fm.deleteFile()).data.DeleteFile
      } catch (e) {
        console.error(e)
      }
    },

    async UploadFile(parent, {file}) {
      const {createReadStream, filename, mimetype, encoding} = await file
      const rs = createReadStream()
      const newFilename = genFileName(mimetype)
      const path = `public/${newFilename}`
      const fm = new FileManager({filename: newFilename, mimetype, encoding}, client)
      await fm.createFile()
      await new Promise((resolve, reject) =>
        rs
          .on('error', async error => {
            if (rs.truncated) {
              await fm.deleteFile()
              fs.unlinkSync(path)
            }
            reject(error)
          })
          .pipe(fs.createWriteStream(path))
          .on('error', error => reject(error))
          .on('finish', () => resolve()))
      return {filename: newFilename, mimetype, encoding}
    },

    SignUp: SignUp(driver),
    SignIn: SignIn(driver),
    CreateRoadMap: CreateRoadMap(driver),
    FulfillNode: FulfillNode(driver),
  },
})
