import jwt from 'jsonwebtoken';

const getUserFromToken = (token, jwt_secret) => {
  try {
    if (token) {
      return jwt.verify(token, jwt_secret)
    }
    return null
  } catch (err) {
    return null
  }
}


export default (client, driver, jwt_secret) => ({ req }) => {
  const tokenWithBearer = req.headers.authorization || ''
  const token = tokenWithBearer.split(' ')[1]
  const jwtPayload = getUserFromToken(token, jwt_secret) || {};
  console.log({ userId: jwtPayload.uuid, username: jwtPayload.username })
  req.user = jwtPayload;
  return { client, driver, jwt_secret, req, cypherParams: { userId: jwtPayload.uuid, username: jwtPayload.username } };
}

