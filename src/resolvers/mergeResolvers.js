const { mergeResolvers } = require('@graphql-tools/merge');
const userResolver = require('./user');
const adminResolver = require('./admin');
const threadResolver = require('./thread');
const postResolver = require('./post');
const mainResolver = require('./main');
const friendshipResolver = require('./friendship');
const messageResolver = require('./message');
const chatResolver = require('./chat');

const resolvers = [
    userResolver,
    adminResolver,
    friendshipResolver,
    threadResolver,
    postResolver,
    mainResolver,
    chatResolver,
    messageResolver
];

module.exports = mergeResolvers(resolvers);
