import gql from 'graphql-tag';

export const GET_NOTIFICATION = gql`
    query{
        readNotification{
            id_friendship,
            id_requested,
            id_addressed,
            id_specifier,
            specifiedtime
            status,
            users{
                id_user,
                username
            }
        }
    }`;