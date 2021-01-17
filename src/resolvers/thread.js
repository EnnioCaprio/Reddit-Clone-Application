const knex = require('../../data/db');

const remodel = (vote) => {
    return vote.map(v => ({
        id_vote: v.id_vote,
        id_thread: v.id_thread,
        id_user: v.id_user,
        status_vote: v.status_vote,
        created: v.created,
        threads: {
            upvote: v.upvote,
            downvote: v.downvote 
        }
    }))
}

module.exports = {
    Thread: {
        users: async (parent, {}, {usersLoader}) => {
            return usersLoader.load(parent.id_user);
        }
    },
    Query: {
        readThread: async () => {
            try{
                const threads = await knex.select('*')
                .table('thread');

                return threads
            }catch(e){
                throw e
            }
        },
        readSingleThread: async (_, {id}) => {
            try{
                const thread = await knex('*')
                .table('thread')
                .where('id_thread', id);

                return thread[0];
            }catch(e){
                throw e
            }
        },
        readVote: async (_, {}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected');
            }
            try{
                const vote = await knex.select('id_vote', 'vote.id_thread', 'vote.id_user', 'status_vote', 'created', 'upvote', 'downvote')
                .from('vote')
                .innerJoin('thread', 'thread.id_thread', '=', 'vote.id_thread')
                .where('vote.id_user', req.session.userId);

                return remodel(vote);
            }catch(e){
                throw e;
            }
        }
    },
    Mutation: {
        createThread: async (parent, {inputThread}, {req}) => {
            if(!req.session.userId){
                throw new Error("Not connected")
            }
            
            try{
                const thread = await knex('thread')
                .insert(
                    {
                        name: inputThread.name,
                        subject: inputThread.subject, 
                        thread_message: inputThread.thread_message, 
                        id_user: req.session.userId,
                        id_main: inputThread.id_main
                    }
                )
                .returning('*');
    
                return thread[0];
            }catch(e){
                throw e
            }
        },
        updateThread: async (_, {updateThread}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const thread = await knex('thread')
                .where('id_thread', updateThread.id_thread)
                .update({
                    id_thread: updateThread.id_thread,
                    name: updateThread.name,
                    subject: updateThread.subject,
                    upvote: updateThread.upvote,
                    downvote: updateThread.downvote
                })
                .returning('*');
    
                return thread[0];
            }catch(e){
                throw e
            }
        },
        addVote: async (_, {id_thread}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected');
            }
            try{    
                const vote = await knex('vote')
                .insert({
                    id_user: req.session.userId,
                    id_thread,
                    status_vote: 'upvote',
                    created: true
                })
                .returning('*');

                return vote[0];
            }catch(e){
                throw e;
            }
        },
        removeVote: async (_, {id_thread}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected');
            }
            try{
                const vote = await knex('vote')
                .insert({
                    id_user: req.session.userId,
                    id_thread,
                    status_vote: 'downvote',
                    created: true
                })
                .returning('*');

                return vote[0];
            }catch(e){
                throw e;
            }
        },
        updateVote: async (_, {id_thread, status_vote}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected');
            }
            try{
                const vote = await knex('vote')
                .update({
                    status_vote
                })
                .where('id_user', req.session.userId)
                .andWhere('id_thread', id_thread)
                .returning('*');

                return vote[0];
            }catch(e){
                throw e;
            }
        },
        restoreVote: async (_, {id_thread, status_vote}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const vote = await knex('vote')
                .update({
                    status_vote
                })
                .where('id_user', req.session.userId)
                .andWhere('id_thread', id_thread)
                .returning('*');

                return vote[0];
            }catch(e){
                throw e;
            }
        }
    }
}