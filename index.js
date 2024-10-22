import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';


import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import mergedResolvers from "./graphql/resolvers/index.js";
import mergedTypeDefs from "./graphql/schemas/index.js";
import { promises } from "dns";

const app = express();

const httpServer = http.createServer(app);


const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})
const PORT = process.env.PORT || 4000;
await server.start()
app.use('/graphql', cors(), express.json(), expressMiddleware(server))

await new Promise(resolve => httpServer.listen(PORT, resolve))
console.log(`Server running on port ${`localhost`}:${PORT ?? 4000}/graphql`)

app.get('/', (req, res) => {
    res.send(`got to <a href='${`localhost`}:${PORT ?? 4000}/graphql' target="_blank">${`localhost`}:${PORT ?? 4000}/graphql</a> to interact with the graphql server`)
})