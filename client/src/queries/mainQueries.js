import gql from 'graphql-tag';

export const GET_MAIN = gql`
    query getSingleMain($id_main: String!){
        getSingleMain(id_main: $id_main){
            id_main,
            name,
            members,
            description,
            subscribed_users,
            created_at,
            threadsMain{
                id_thread,
                name,
                created_at,
                thread_message,
                upvote,
                downvote,
                id_main,
                id_user,
                users{
                    id_user,
                    username
                },
                postsThread{
                    id_message
                }
            }
        }
    }`;

export const JOINING_MAIN = gql`
    mutation joinMain($id: String!){
        joinMain(id: $id){
            id_main,
            name,
            subscribed_users
        }
    }`;

export const REMOVE_MAIN = gql`
    mutation removeMain($id: String!){
        removeMain(id: $id){
            id_main,
            name,
            subscribed_users
        }
    }`;
