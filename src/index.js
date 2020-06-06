import { typeDefs } from "graphql-schema";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import driver from 'driver';
import client from 'client';
import context from 'context';
import resolvers from 'resolvers'
import { makeAugmentedSchema } from "neo4j-graphql-js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// server the damn static files pls
app.use('/static', express.static('public'))

const schema = makeAugmentedSchema({
  typeDefs,
  resolvers: resolvers
});

const jwt_secret = process.env.JWT_SECRET;

const server = new ApolloServer({
  context: context(client ,driver, jwt_secret),
  schema: schema,
  introspection: true,
  playground: true
});

const port = process.env.GRAPHQL_LISTEN_PORT || 4001;
const path = "/graphql";

server.applyMiddleware({app, path});

app.listen({port, path}, () => {
  console.log(`GraphQL server ready at http://localhost:${port}${path}`);
});
