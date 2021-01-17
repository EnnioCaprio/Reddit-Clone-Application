const knex = require('../../data/db');

const NEW_POST = 'POST';

const remodel = (data) => {
    return data.map(d => ({
        id_message: d.id_message,
        message: d.message,
        created_at: d.created_at,
        user: {
            id_user: d.id_user,
            username: d.username,
            deleted: d.deleted
        }
    }))
}

module.exports = {
    Query:{
        readPost: async (_, {id}) => {
            try{
                const posts = await knex
                .select()
                .table('post')
                .innerJoin('users', 'users.id_user', '=', 'post.id_user')
                .where('id_thread', id);

                return remodel(posts);
            }catch(e){
                throw e
            }
        }
    },
    Mutation:{
        createPost: async (_, {inputsPost}, {req, pubSub}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }    

            try{
                const post = await knex('post')
                .insert({message: inputsPost.message, id_user: req.session.userId, id_thread: inputsPost.id_thread})
                .returning('*');

                pubSub.publish(NEW_POST, {
                    newPost: post[0]
                });

                return post[0];
            }catch(e){
                throw e
            } 
        },
        deletePost: async (_, {id_message}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const post = await knex('post')
                .where('id_message', id_message)
                .delete()
                .returning('*');

                return post[0];
            }catch(e){
                throw e
            }
        },
        updatePost: async (_, {id_message, inputsPost}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const post = await knex('post')
                .where('id_message', id_message)
                .update({message: inputsPost.message})
                .returning('*');

                return post[0]
            }catch(e){
                throw e
            }
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, {}, {pubSub, connection}) => {
                if(!connection.context.req.session.userId){
                    throw new Error('Not connected')
                }

                return pubSub.asyncIterator([NEW_POST]);
            }
        }
    }
}