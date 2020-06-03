import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import omit from 'lodash.omit';
import {createSession, createWriteSession} from 'core/neo4jSession';

export const SignUp = driver => async (_, { name, surname, username, email, password, confirmPassword }) => {
  const session = createSession(driver);
  const { records } = await session.run(`match (p:Person) where p.username="${username}" or p.email = "${email}" return p`);
  if (!records.length) {
    const hash = bcrypt.hashSync(password, 10);
    const { records } = await session.run(`create (p:Person { uuid: apoc.create.uuid(), name: "${name}", surname: "${surname}", username: "${username}", email: "${email}", password: "${hash}" }) return p`)
    session.close();
    const data = omit(records[0].toObject().p.properties, ['password']);
    return {
      token: jwt.sign({name: 1}, 'secret'),
      ...data,
    }
  }
}

export const SignIn = driver => async (_, {login, password}) => {
  const session = createWriteSession(driver);
  console.log(`match (p:Person) where p.username="${login}" or p.email="${password}" return p`);
  const { records } = await session.run(`match (p:Person) where p.username="${login}" or p.email="${password}" return p`);
  session.close();
  if (records.length) {
    const [record] = records;
    const { password: hash, ...rest } = record.toObject().p.properties;

    if (bcrypt.compareSync(password, hash)) {
      console.log('success');
      return {
        token: jwt.sign(rest, 'secret'),
        ...rest,
        errors: [],
      };
    } else {
      return {
        errors: [{key: 'password', value: 'Incorrect Password'}],
        token: '',
        name: '',
        uuid: '',
        surname: '',
        email: '',
        username: '',
      };
    }
  } else {
    console.log('here')
    return {
      errors: [{key: 'login', value: 'No such username or email'}],
      token: '',
      name: '',
      uuid: '',
      surname: '',
      email: '',
      username: '',
    };
  }
}
