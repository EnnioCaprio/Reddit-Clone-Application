const knex = require('../../data/db');

const remodel = (threads) => {
    return threads.map(thread => ({
        id_thread: thread.id_thread,
        posts: thread.json_agg
    }))
}

const hybris = (main) => {
    return main.map(m => ({
        id_main: m.main_id,
        name: m.main_name,
        description: m.main_description,
        members: m.main_members,
        subscribed_users: m.subscribed_users_main,
        created_at: m.created_at_main,
        threadsPage: {
            id_main: m.main_thread,
            id_thread: m.thread_id,
            name: m.thread_name,
            upvote: m.thread_upvote,
            created_at: m.thread_created_at,
            thread_message: m.thread_message,
            downvote: m.thread_downvote,
            users_delete: m.delete_user_thread,
            usersThread: {
                id_user: m.user_id,
                username: m.users_username,
                deleted: m.deleted_user
            }
        }
    }))
}

const remodelThread = (thread) => {
    return thread.map(m => ({
        id_thread: m.id_thread,
        name: m.name,
        subject: m.subject,
        created_at: m.created_at,
        thread_message: m.thread_message,
        upvote: m.upvote,
        downvote: m.downvote,
        users_delete: m.users_delete,
        id_main: m.id_main,
        id_user: m.id_user,
        postsThread: m.json_agg
    }))
}

module.exports = {
    Main: {
        threads: async (parent, {id}, context) => {
            try{
                const threads = await knex.select('thread.id_thread',
                knex.raw(`
                json_agg(json_build_object(
                'id_message', post.id_message,
                'created_at', post.created_at,
                'message', post.message,
                'updated_at', post.updated_at,
                'id_user', post.id_user
                ))`
                ))
                .from('thread')
                .innerJoin('post', 'post.id_thread', '=', 'thread.id_thread')
                .where('thread.id_main', parent.id_main)
                .andWhere('thread.id_thread', id)
                .groupBy('thread.id_thread')

                const modd = remodel(threads)

                return modd
            }catch(e){
                throw e
            }
        },
        threadsMain: async (parent) => {
            try{
                const threads = await knex
                .select('thread.id_thread', 'thread.id_user', 'subject', 'name', 'thread_message', 'thread.created_at', 'upvote', 'downvote', 'thread.id_main', 'users_delete',
                knex.raw(`
                    json_agg(json_build_object(
                        'id_message', id_message
                    ))
                `))
                .from('thread')
                .leftJoin('post', 'post.id_thread', '=', 'thread.id_thread')
                .where('id_main', parent.id_main)
                .groupBy('thread.id_thread', 'thread.id_user', 'subject', 'name', 'thread_message', 'thread.created_at', 'upvote', 'downvote', 'thread.id_main', 'users_delete');

                const result = remodelThread(threads);

                return result;
            }catch(e){
                throw e
            }
        }
    },
    Query: {
        readMain: async () => {
            try{
                const main = await knex
                .select('*')
                .table('main')

                return main
            }catch(e){
                throw e
            }
        },
        readAllMain: async () => {
            try{
                const main = await knex('main')
                .select('main.id_main AS main_id', 'main.name AS main_name', 'main.description AS main_description', 'main.members AS main_members', 'main.subscribed_users AS subscribed_users_main', 'main.created_at AS created_at_main', 'thread.id_main AS main_thread', 'thread.id_thread AS thread_id', 'thread.name AS thread_name', 'thread.created_at AS thread_created_at', 'thread.upvote AS thread_upvote', 'thread_message', 'thread.downvote AS thread_downvote', 'thread.users_delete AS delete_user_thread', 'users.id_user AS user_id', 'users.username AS users_username', 'users.deleted AS deleted_user')
                .innerJoin('thread', 'thread.id_main', '=', 'main.id_main')
                .innerJoin('users', 'users.id_user', '=', 'thread.id_user');

                const a = hybris(main);

                return a;
            }catch(e){
                throw e
            }
        },
        getSingleMain: async (_, {id_main}) => {
            try{
                const main = await knex('*')
                .table('main')
                .where('id_main', id_main);

                return main[0]
            }catch(e){
                throw e
            }
        },
        readMainName: async (_, {name}) => {
            try{
                const main = await knex('*')
                .table('main')
                .where('name', 'like', `${name}%`);

                return main;
            }catch(e){
                throw e;
            }
        }
    },  
    Mutation: {
        createMain: async (_,{inputsMain}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }

            const subname = inputsMain.name.replace(/ +/g, "");
            try{
                const main = await knex('main')
                .insert({name: inputsMain.name, sub_name: subname, description: inputsMain.description})
                .returning('*')

                return main[0]
            }catch(e){
                throw e
            }
        },
        deleteMain: async (_,{id}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const main = await knex('main')
                .where('id_main', id)
                .del()
                .returning('*');

                return main[0]
            }catch(e){
                throw e
            }
        },
        updateMain: async (_,{id, updateMain}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            const name = updateMain.name.replace(/ +/g, "");
            try{
                const main = await knex('main')
                .update({name, description: updateMain.description})
                .where('id_main', id)
                .returning('*');

                return main[0]
            }catch(e){
                throw e
            }
        },
        joinMain: async (_, {id}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const main = await knex('main')
                .update('subscribed_users', knex.raw(`array_append(subscribed_users, '${req.session.userId}')`))
                .where('id_main', id)
                .returning('*');

                return main[0];
            }catch(e){
                throw e;
            }
        },
        removeMain: async (_, {id}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected');
            }
            try{
                const main = await knex('main')
                .update('subscribed_users', knex.raw(`array_remove(subscribed_users, '${req.session.userId}')`))
                .where('id_main', id)
                .returning('*');

                return main[0];
            }catch(e){

            }
        }
    }
}