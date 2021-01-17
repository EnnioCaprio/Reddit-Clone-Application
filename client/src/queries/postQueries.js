import gql from 'graphql-tag';

export const CREATE_POST = gql`
    mutation createPost($message: String!, $id_thread: String!){
        createPost(inputsPost: {message: $message, id_thread: $id_thread}){
            id_message,
            message,
            id_user,
            created_at
        }
    }`;

export const GET_POST = gql`
    query readPost($id: String!){
        readPost(id: $id){
            id_message,
            message,
            created_at,
            user{
                id_user,
                username,
                deleted
            }
        }
    }`;

export const UPDATE_POST = gql`
    mutation updatePost($id_message: ID!, $message: String!){
        updatePost(id_message: $id_message, inputsPost: {message: $message}){
            id_message,
            message,
            id_user
        }
    }`;

export const DELETE_POST = gql`
    mutation deletePost($id_message: ID!){
        deletePost(id_message: $id_message){
            id_message
        }
    }`;