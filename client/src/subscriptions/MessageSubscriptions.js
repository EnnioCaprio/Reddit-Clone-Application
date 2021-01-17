import { gql } from '@apollo/client';

export const sendMessage = gql`
    subscription newMessage($id_chat: String!){
        newMessage(id_chat: $id_chat){
            id_message,
            message,
            id_chat,
            id_user,
            created_at,
            username
        }
    }
`;