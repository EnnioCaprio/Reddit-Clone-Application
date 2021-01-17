import gql from 'graphql-tag';

export const GET_THREADS = gql
    `query{
        readAllMain{
        id_main,
        name,
        description,
        members,
        created_at,
        subscribed_users,
        threadsPage{
            id_thread,
            name,
            created_at,
            upvote,
            downvote,
            thread_message,
            users_delete,
            id_main
            usersThread{
                id_user,
                username,
                deleted
            }
        }
    }
}`;

export const GET_VOTE = gql`
    query readVote{
        readVote{
            id_vote,
            id_user,
            id_thread,
            status_vote,
            created,
            threads{
                upvote,
                downvote
            }
        }
    }`;

export const ADD_VOTE = gql`
    mutation addVote($id_thread: String!){
        addVote(id_thread: $id_thread){
            id_user,
            id_thread,
            status_vote
        }
    }`;

export const REMOVE_VOTE = gql`
    mutation removeVote($id_thread: String!){
        removeVote(id_thread: $id_thread){
            id_user,
            id_thread,
            status_vote
        }
    }`;

export const UPDATE_VOTE = gql`
    mutation updateVote($id_thread: String!, $status_vote: String!){
        updateVote(id_thread: $id_thread, status_vote: $status_vote){
            id_vote,
            id_user,
            id_thread,
            status_vote
        }
    }`;

export const RESTORE_VOTE = gql`
    mutation restoreVote($id_thread: String!, $status_vote: String!){
        restoreVote(id_thread: $id_thread, status_vote: $status_vote){
            id_vote,
            id_thread,
            id_user,
            status_vote
        }
    }`;