const knex = require('../../data/db');

const remodel = (room) => {
    return room.map(r => ({
        id_chat: r.id_chat,
        name: r.name,
        users: r.json_agg
    }))
}

module.exports = {
    Query: {
        readAllChats: async (_, __, {req}) => {
            if(!req.session.userId){
                throw new Error('Not conncted');
            }

            try{
                const chat = await knex('chat')
                .where('id_user', req.session.userId)
                .orWhere(knex.raw(`list @> ARRAY[('${req.session.userId}')::uuid]`));

                return chat;
            }catch(e){
                throw e;
            }
        },
        readSingleChat: async (_, {id_chat}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }

            try{
                const chat = await knex
                .raw(`SELECT id_chat, name,
                json_agg(json_build_object(
                    'id_user', users.id_user,
                    'username', username
                ))
                FROM users
                CROSS JOIN chat
                WHERE id_chat = '${id_chat}'
                AND list @> ARRAY[users.id_user]
                GROUP BY id_chat
                `);
                
                const result = remodel(chat.rows);

                return result;
            }catch(e){
                throw e;
            }
        },
        readMessages: async (_, {id_chat}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{    
                const message = await knex
                .select('*')
                .from('messages')
                .where('id_chat', id_chat);

                return message;
            }catch(e){
                throw e
            }
        }
    },
    Mutation: {
        createChat: async (_, {inputCreateChats}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected');
            }
            
            try{
                const chat = await knex('chat')
                .insert({
                    name: inputCreateChats.name,
                    id_user: req.session.userId,
                    list: inputCreateChats.list
                })
                .returning('*');

                return chat;
            }catch(e){
                throw e
            }
        }
    }
}