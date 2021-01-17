const knex = require('../../data/db');
const bcrypt = require('bcrypt');

const remodel = (threads) => {
    return threads.map(thread => ({
        id_thread: thread.id_thread,
        id_main: thread.id_main,
        id_user: thread.id_user,
        name: thread.name,
        subject: thread.subject,
        created_at: thread.created_at,
        thread_message: thread.thread_message,
        upvote: thread.upvote,
        downvote: thread.downvote,
        posts: thread.json_agg
    }))
}

module.exports = {
    User: {
        threads: async () => {
            let threadsAll;
            try{
                threadsAll = await knex
                .select('thread.id_thread', 'thread.id_user', 'name', 'subject', 'thread.created_at', 'thread.thread_message', 'thread.upvote', 'thread.downvote', 'thread.id_main',
                        knex.raw(`
                        COALESCE(json_agg(json_build_object(
                        'id_message', post.id_message,
                        'created_at', post.created_at,
                        'message', post.message,
                        'updated_at', post.updated_at,
                        'id_user', post.id_user
                        )) FILTER (WHERE post.id_message IS NOT NULL), '[]') AS json_agg`
                    ))
                .from('thread')
                .leftJoin('post', 'post.id_thread', '=', 'thread.id_thread')
                .groupBy('thread.id_thread', 'thread.id_user', 'name', 'subject', 'thread.created_at', 'thread.thread_message', 'thread.upvote', 'thread.downvote', 'thread.id_main')

                return remodel(threadsAll);
            }catch(e){
                throw e
            }
        }
    },
    Query: {
        users: async () => {
            try{
                const user = await knex
                .select()
                .table('users');

                return user;
            }catch(e){
                throw e
            }
        },
        profile: async (_, __, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }

            try{
                const profile = await knex('*')
                .table('users')
                .where('id_user', req.session.userId);

                return profile[0];
            }catch(e){
                throw e
            }
        },
        userProfile: async (_, {id}) => {
            try{
                const user = await knex('*')
                .table('users')
                .where('id_user', id)

                return user[0];
            }catch(e){
                throw e
            }
        },
        getCookies: async (_, {}, {req}) => {
            if(!req.session.userId){
                return false
            }else{
                return true;
            }
        },
        getSingleMain: async (_, {name}) => {
            try{
                const main = await knex
                .select('*')
                .table('main')
                .where('name', name);

                return main[0];
            }catch(e){
                throw e
            }
        }
    },
    Mutation: {
        registration: async (_, {inputsUser}) => {
            try{
                const hashPassword = await bcrypt.hash(inputsUser.password, 10);
                const user = await knex('users')
                .insert({username: inputsUser.username, email: inputsUser.email, password: hashPassword, deleted: false})
                .returning('*');
    
                return user[0];
            }catch(e){
                throw e
            }
        },
        updateUser: async (_, {id, updateInputsUser}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const user = await knex("users")
                .where("id_user", req.session.userId)
                .update({
                    username: updateInputsUser.username,
                    email: updateInputsUser.email,
                    password: updateInputsUser.password,
                    deleted: false
                })
                .returning('*');
    
                if(!user[0]){
                    throw new Error("user doesn't exist")
                }
    
                return user[0]
            }catch(e){
                throw e
            }
        },
        updateSetting: async (_ , {updateInputsUser}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected');
            }
            try{
                const hashedPassword = updateInputsUser.password && await bcrypt.hash(updateInputsUser.password, 10);

                const user = await knex('users')
                .where('id_user', req.session.userId)
                .update({
                    username: updateInputsUser.username,
                    email: updateInputsUser.email,
                    password: hashedPassword
                })
                .returning('*');

                return user[0];
            }catch(e){
                throw e;
            }
        },
        deleteUser: async (_, __, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const user = await knex('users')
                .where('id_user', req.session.userId)
                .update({deleted: true})
                .returning('*');

                return user[0];
            }catch(e){
                throw e
            }
        },
        login: async (_, {email, password}, {req}) => {

            const user = await knex
            .select()
            .table('users')
            .where('email', email);
    
            if(!user){
                throw new Error("not correct email");
            }else if(user[0].deleted){
                throw new Error("user doesn't exist")
            }
    
            const checkPassword = await bcrypt.compare(password, user[0].password);
    
            if(!checkPassword){
                throw new Error("not correct password");
            }

            req.session.userId = user[0].id_user
    
            return user[0];
        },
        logout: async (_, __, {req, res}) => {
            await new Promise(res => req.session.destroy(() => res()))
            res.clearCookie("connect.sid");
            return true
        }
    }
}