import gql from 'graphql-tag';

export const UPDATE_THREAD = gql `
    mutation updateThread($id_thread: String!, $name: String, $subject: String!){
        updateThread(updateThread: {id_thread: $id_thread, name: $name, subject: $subject}){
            id_thread,
            name,
            subject
        }
    }`;

export const GET_MAIN = gql`
        query readMain{
            readMain{
                id_main,
                name
            }
        }
    `;

export const CREATE_THREAD = gql`
        mutation createThread($name: String!, $subject: String!, $thread_message: String!, $id_main: String!){
            createThread(inputThread: {name: $name, subject: $subject, thread_message: $thread_message, id_main: $id_main}){
                id_thread,
                name,
                subject
            }
        }
    `;

export const GET_SINGLE_THREAD = gql`
        query readSingleThread($id: String!){
            readSingleThread(id: $id){
                id_thread,
                name,
                upvote,
                downvote,
                created_at,
                thread_message,
                id_main
            }
        }`;

