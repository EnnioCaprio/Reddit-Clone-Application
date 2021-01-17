import gql from 'graphql-tag';

export const SINGLE_CHAT = gql`
    query readSingleChat($id_chat: String!){
        readSingleChat(id_chat: $id_chat){
            id_chat,
            name,
            users{
                id_user,
                username
            }
        }
    }`;

export const GET_MESSAGES = gql`
    query readMessages($id_chat: String!){
        readMessages(id_chat: $id_chat){
            id_user,
            username,
            id_message,
            message,
            created_at
        }
    }`;

export const CREATE_CHAT = gql`
    mutation createChat($name: String!, $list: [String!]){
        createChat(inputCreateChats: {name: $name, list: $list}){
            id_chat,
            name, 
            id_user,
            list
        }
    }`;

export const SEND_MESSAGE = gql`
    mutation sendMessage($message: String!, $id_chat: String!){
        sendMessage(message: $message, id_chat: $id_chat){
            id_message,
            message,
            created_at,
            username,
            id_chat,
            id_user
        }
    }`;