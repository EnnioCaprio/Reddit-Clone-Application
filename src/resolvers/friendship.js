const knex = require('../../data/db');

const remodel = (notification) => {
    return notification.map(n => ({
        id_friendship: n.id_friendship,
        id_requested: n.id_requested,
        id_addressed: n.id_addressed,
        id_specifier: n.id_specifier,
        specifiedtime: n.specifiedtime,
        status: n.status,
        users: {
            id_user: n.id_user,
            username: n.username
        }
    }))
}

module.exports = {
    Query: {
        readFriends: async (_, {}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const friends = await knex.raw(`SELECT id_user, username 
                FROM users 
                WHERE id_user IN (
                                    SELECT COALESCE(
                                        CASE 
                                        WHEN id_specifier = '${req.session.userId}' AND status = 'A'
                                        THEN id_requested
                                        ELSE 
                                            CASE 
                                            WHEN id_requested = '${req.session.userId}' AND status = 'A'
                                            THEN id_addressed ELSE null END
                                        END
                                    ) FROM friendshipstatus
                )`)

                return friends.rows
            }catch(e){
                throw e
            }
        },
        readNotification: async (_, {}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const notification = await knex
                .select('*')
                .from('friendshipstatus')
                .innerJoin('users', 'users.id_user', '=', 'friendshipstatus.id_specifier')
                .where('id_specifier', '!=', req.session.userId)
                .andWhere('status', 'R')
                .andWhere('id_addressed', '=', req.session.userId);

                const data = remodel(notification);

                return data;
            }catch(e){
                throw e
            }
        },
        waiting: async (_, {id_addressed}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const request = await knex('*')
                .from('friendshipstatus')
                .where('id_addressed', id_addressed)
                .andWhere('status', 'R')
                .andWhere('id_specifier', req.session.userId);

                if(request.length > 0){
                    return true;
                }else{
                    return false;
                }
                
            }catch(e){
                throw e
            }
        }
    },
    Mutation: {
        sendFriendship: async (_, {id_addressed}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }
            try{
                const friendship = await knex('friendshipstatus')
                .insert({
                    id_requested: req.session.userId, 
                    id_addressed,
                    status: 'R',
                    id_specifier: req.session.userId
                })
                .returning('*');

                const selectInfo = await knex
                .select('*')
                .from('friendshipstatus')
                .innerJoin('users', 'users.id_user', '=', 'friendshipstatus.id_addressed')
                .where('id_user', friendship[0].id_addressed);

                return remodel(selectInfo)[0];
            }catch(e){
                throw e
            }
        },
        updateFriendshipStatus: async (_, {id_friendship, status}, {req}) => {
            if(!req.session.userId){
                throw new Error('Not connected')
            }

            try{
                const friendshipUpd = await knex('friendshipstatus')
                .where('id_friendship', id_friendship)
                .update({
                        status,
                        id_specifier: req.session.userId
                })
                .returning('*');

                return friendshipUpd[0];
            }catch(e){
                throw e
            }
        }
    }
}