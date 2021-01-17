const knex = require('../../data/db');

module.exports = {
    Query: {
        users: async () => {
            try{
                const users = await knex.select().table('users');
    
                if(!users){
                    throw new Error('no users')
                }
    
                if(!users){
                    return {
                        message: 'No users'
                    }
                }
            
                return users;
            }catch(e){
                throw e
            }
        }
    },
    Mutation: {
        banUser: async (_, {id}, {req}) => {
            if(!req.isAuth){
                throw new Error('Not connected');
            }
            try{
                const bannedUser = await knex('users')
                .where('id', id)
                .delete()
                .returning('*');
    
                return bannedUser[0]
            }catch(e){
                throw e
            }
        }
    }
}