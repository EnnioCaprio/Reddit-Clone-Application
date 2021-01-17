import gql from 'graphql-tag';

export const LOGOUT = gql `
    mutation{
        logout
    }`;

export const UPDATE_NOTIFICATION = gql`
    mutation updateFriendshipStatus($id_friendship: String, $status: String!){
        updateFriendshipStatus(id_friendship: $id_friendship, status: $status){
            id_friendship,
            id_requested,
            id_addressed,
            specifiedtime,
            status,
            users{
                id_user,
                username
            }
        }
    }`;