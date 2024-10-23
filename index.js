import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import dotenv from 'dotenv';
import connectToDb from './db/connectToDb.js'

import { ApolloServer } from "@apollo/server";

import mergedResolvers from "./graphql/resolvers/index.js";
import mergedTypeDefs from "./graphql/schemas/index.js";

import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import passport from "passport";
import { buildContext } from "graphql-passport";
import { passportConfig } from "./passport/passport.config.js";
dotenv.config();

await passportConfig();
const app = express();

const httpServer = http.createServer(app);

const MongoDBStore = ConnectMongoDBSession(session);

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",

})

store.on("error", (err) => console.error(`error: ${err}`));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());


const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

})
const PORT = process.env.PORT || 4000;
await server.start()
app.use('/graphql', cors({
    origin: '*', // is allowed for all
    credentials: true
}), express.json(), expressMiddleware(server, {
    context: ({ req, res }) => buildContext({ req, res })
}));

await new Promise(resolve => httpServer.listen(PORT, resolve))
console.log(`Server running on port ${`localhost`}:${PORT ?? 4000}/graphql`)

await connectToDb();
