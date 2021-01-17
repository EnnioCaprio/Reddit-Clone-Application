const knex = require('../../data/db');
const { withFilter } = require('graphql-subscriptions')

const NEW_MESSAGE = 'NEW_MESSAGE';

module.exports = {
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_, {}, {pubSub, connection}) => {
                    if(!connection.context.req.session.userId){
                        throw new Error('Not connected');
                    }
                    return pubSub.asyncIterator(NEW_MESSAGE)
                },
                (payload, variables) => {
                    return payload.newMessage.id_chat === variables.id_chat
                }
            )
        }
    },
    Query: {

    },
    Mutation: {
        sendMessage: async (_, args, {req, pubSub}) => {
            if(!req.session.userId){
                throw new Error('Not connected');
            }

            try{
                const message = await knex('messages')
                .insert({
                    message: args.message,
                    id_chat: args.id_chat,
                    id_user: req.session.userId,
                    username: knex.select('username').from('users').where('id_user', req.session.userId)
                })
                .returning('*');

                pubSub.publish(NEW_MESSAGE, {
                    newMessage: message[0]
                })

                return message[0];
            }catch(e){
                throw e
            }
        }
    }
}