import gql from 'graphql-tag';

export const GET_PROFILE = gql`
    query getProfile{
        profile{
            id_user,
            username,
            email,
            password,
            created_at,
            threads{
                id_thread,
                name,
                subject,
                id_user,
                created_at,
                thread_message,
                upvote,
                downvote,
                id_main
                posts{
                    id_message
                    message,
                    created_at
                    id_user
                }
            }
        }
    }`;

export const GET_FRIENDS = gql`
    query readFriends{
        readFriends{
            id_user,
            username
        }
    }`;

export const GET_OTHERS = gql`
    query getOtherProfile($id: String!){
    userProfile(id: $id){
        id_user,
        username,
        email,
        password,
        created_at,
        threads{
            id_thread,
            name,
            subject,
            id_user,
            created_at,
            thread_message,
            upvote,
            downvote,
            id_main
            posts{
                id_message
                message,
                created_at
                id_user
            }
        }
    }
}`;

export const GET_PROFILE_FIRST = gql`
    query getProfile{
        profile{
            id_user,
            username,
            email,
            password,
            created_at
        }
    }`;

export const REGISTRATION = gql`
    mutation registrationUser($username: String!, $email: String!, $password: String!){
        registration(inputsUser: {username: $username, email: $email, password: $password}){
        username,
        email,
        password
        }
    }`;

export const GET_SINGLE_MAIN = gql`
    query getSingleMain($id_main: String!){
        getSingleMain(id_main: $id_main){
            id_main,
            name,
            description,
            members,
            created_at,
            subscribed_users
        }
    }`;

export const WAITING = gql`
        query waiting($id_addressed: String!){
            waiting(id_addressed: $id_addressed)
        }
    `;

export const SEND_REQUEST = gql`
    mutation sendFriendship($id_addressed: String!){
        sendFriendship(id_addressed: $id_addressed){
            id_friendship,
            id_requested,
            id_addressed,
            specifiedtime,
            status,
            id_specifier,
            users{
                id_user,
                username
            }
        }
    }`;

export const DO_LOGIN = gql`
    mutation doLogin($email: String!, $password: String!){
        login(email: $email, password: $password){
            id_user,
            username,
            email
        }
    }`;

export const DELETE_PROFILE = gql`
    mutation deleteUser{
        deleteUser{
            id_user,
            username,
            email
        }
    }`;

export const UPDATE_USERNAME = gql`
    mutation updateSetting($username: String!){
        updateSetting(updateInputsUser: { username: $username }){
            id_user,
            username,
            email,
            password
        }
    }`;

export const UPDATE_EMAIL = gql`
    mutation updateSetting($email: String!){
        updateSetting(updateInputsUser: { email: $email }){
            id_user,
            username,
            email,
            password
        }
    }`;

export const UPDATE_PASSWORD = gql`
    mutation updateSetting($password: String!){
        updateSetting(updateInputsUser: { password: $password }){
            id_user,
            username,
            email,
            password
        }
    }`;