const express = require('express');
const http = require('http');
require('dotenv').config()
const session = require('express-session');
const { ApolloServer, PubSub } = require('apollo-server-express');
const typeDefs = require('./schemas/schema');
const resolvers = require('./resolvers/mergeResolvers');
const cors = require('cors');
const DataLoader = require('dataloader');
const cookieParser = require('cookie-parser');
const knex = require('../data/db');

const start = async () => {
    const app = express();
    
    const sessionMiddleware = session({
        secret: process.env.SECRET_TOKEN,
        resave: false,
        saveUninitialized: false
    })

    app.use(sessionMiddleware)

    const pubSub = new PubSub();

    const port = process.env.PORT || 4000;

    console.log(process.env.NODE_ENV);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req, res, connection}) => ({
                req,
                res,
                connection,
                pubSub,
                usersLoader: new DataLoader(async keys => {
                    try{
                        const users = await knex('*')
                        .table('users')
                        .whereIn('id_user', keys);

                        const usersMap = {};
                        users.forEach(u => {
                            usersMap[u.id_user] = u
                        });

                        return keys.map(key => usersMap[key]);
                    }catch(e){
                        throw e
                    }
                })
            }),
        subscriptions: {
            onConnect: (_, ws) => {
                return new Promise(res => 
                    sessionMiddleware(ws.upgradeReq, {}, () => {
                        res({ req: ws.upgradeReq });
                    })
                )
            }
        }    
    });

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
        allowedHeaders: '*'
    }));
    app.use(cookieParser());
    app.use(express.json());

    server.applyMiddleware({ 
        app,
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
            allowedHeaders: '*'
        }
     })

    const httpServer = http.createServer(app);
    
    server.installSubscriptionHandlers(httpServer);

    httpServer.listen({port}, () => {
        console.log(`Listening on server http://localhost:4000${server.graphqlPath}`)
    })
}

start();