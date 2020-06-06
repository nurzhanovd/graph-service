import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import omit from 'lodash.omit';
import {createSession, createWriteSession} from 'core/neo4jSession';

export const CurrentUser = async (_, args, context) => {
  const { driver, req } = context;
  const username = req.user.username;
  const session = createSession(driver);
  const { records } = await session.run(`match (p:Person) where p.username="${username}" return p`);
  if (!records.length) {
    const [record] = records;
    return omit(record.toObject().p.properties, ['password']);
  }
  session.close();
  return null
}

export const SignUp = driver => async (_, { username, email, password, confirmPassword }, context) => {
  const {jwt_secret} = context;
  const session = createSession(driver);
  const { records } = await session.run(`match (p:User) where p.username="${username}" or p.email = "${email}" return p`);
  if (!records.length) {
    const hash = bcrypt.hashSync(password, 10);
    const { records } = await session.run(`create (p:User { uuid: apoc.create.uuid(), username: "${username}", email: "${email}", password: "${hash}" }) return p`)
    session.close();
    const data = omit(records[0].toObject().p.properties, ['password']);
    return {
      token: jwt.sign({username}, jwt_secret),
      ...data,
      errors: [],
    }
  } else {
    return {
      token: null,
      uuid: null,
      email: null,
      username: null,
      errors: [
        { key: 'general', value: 'Profile with such username/email already exists!' }
      ]
    }
  }
}

export const SignIn = driver => async (_, {login, password}, context) => {
  const {jwt_secret} = context
  const session = createWriteSession(driver);
  console.log(`match (p:User) where p.username="${login}" or p.email="${password}" return p`);
  const { records } = await session.run(`match (p:User) where p.username="${login}" or p.email="${password}" return p`);
  session.close();
  if (records.length) {
    const [record] = records;
    const { password: hash, ...rest } = record.toObject().p.properties;

    if (bcrypt.compareSync(password, hash)) {
      console.log('success');
      return {
        token: jwt.sign(rest, jwt_secret),
        ...rest,
        errors: [],
      };
    } else {
      return {
        errors: [{key: 'password', value: 'Incorrect Password'}],
        token: '',
        uuid: '',
        email: '',
        username: '',
      };
    }
  } else {
    console.log('here')
    return {
      errors: [{key: 'login', value: 'No such username or email'}],
      token: '',
      uuid: '',
      email: '',
      username: '',
    };
  }
}
