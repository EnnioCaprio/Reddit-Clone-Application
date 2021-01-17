import { gql } from '@apollo/client';

export const postSubscription = gql`
    subscription newPost{
        newPost{
            id_message,
            message,
            id_user,
            created_at
        }
    }   
`;

export const writing = gql`
    subscription writing{
        writing
    }
`