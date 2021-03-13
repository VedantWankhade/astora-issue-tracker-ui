// fs to read from files
const fs = require('fs')
const express = require('express')
const {GraphQLScalarType, Kind} = require('graphql')
const {ApolloServer, UserInputError} = require('apollo-server-express')

let aboutMessage = "Astora issue tracker API v1.0";

// temporary list of issues
const issuesDB = [
    {
        id: 1, status: 'New', owner: 'Ravan', effort: 5,
        created: new Date('2019-01-15'), due: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
        created: new Date('2019-01-16'), due: new Date('2019-02-01'),
        title: 'Missing bottom border on panel',
    },
];

// scalar Date type for graphQL api
const GraphQLDate = new GraphQLScalarType({
    name: "GraphQLDate",
    description: "A Date type in GraphQL as a scalar",

    // function to convert Date object into a precise date string
    serialize(value) {
        return value.toISOString();
    },

    // function to convert inline input date string into a Date object
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            const value = new Date(ast.value);
            return isNaN(value) ? undefined : value;
        }
    },

    // function to convert variable input date string into a Date object
    parseValue(value) {
        const dateValue = new Date(value);
        return isNaN(dateValue) ? undefined : dateValue;
    },
})

// function to validate user inputs
function validateIssue(issue) {

    const errors = [];

    if (issue.title.length < 3) {
        errors.push('Field "title" must be at least 3 characters long.')
    }
    if (issue.status === 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned"');
    }
    if (errors.length > 0) {
        // ApolloServer error BAD_USER_INPUT
        throw new UserInputError('Invalid input(s)', {errors});
    }
}

// fields to serve the api calls
const apiResolvers = {
    Query: {
        about: () => aboutMessage,
        // returns the list of issues as a graphQL type [Issue]
        issueList: () => issuesDB
    },
    Mutation: {
        setAboutMessage: (_, { message }) => {
            return aboutMessage = message;
        },
        // adds issue to the issuesDB list, takes Issue graphQL type
        issueAdd: (_, { issue }) => {
            validateIssue(issue);
            issue.created = new Date();
            issue.id = issuesDB.length + 1;
            issuesDB.push(issue);
            return issue;
        }
    },
    GraphQLDate
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync('server/schema.graphql', 'utf-8'),
    resolvers: apiResolvers,
    // show user input errors in server console
    formatError: (error) => {
        console.log(error);
        return error;
    },
});


const app = express();
const middleware = express.static('public');
// apply graphql api middleware to express app at path /api
server.applyMiddleware({app, path: '/api'});

app.use('/', middleware);

app.listen(3000, function() {

    console.log('App started at port http://localhost:3000');
})