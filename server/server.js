const express = require('express');
const {ApolloServer} = require('apollo-server-express')
const fs = require('fs')

let aboutMessage = "Astora issue tracker API v1.0";

const apiResolvers = {
    Query: {
        about: () => aboutMessage,
    },
    Mutation: {
        setAboutMessage: (_, { message }) => {
            return aboutMessage = message;
        },
    },
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync('server/schema.graphql', 'utf-8'),
    resolvers: apiResolvers
});


const app = express();
const middleware = express.static('public');
server.applyMiddleware({app, path: '/api'});

app.use('/', middleware);

app.listen(3000, function() {

    console.log('App started at port http://localhost:3000');
})