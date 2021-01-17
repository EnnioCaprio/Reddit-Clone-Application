const { gql } = require('apollo-server-express');

module.exports = gql`
    type Main{
        id_main: String!
        name: String!
        sub_name: String!
        members: Int
        description: String!
        subscribed_users: [String!]
        created_at: String!
        threads(id: ID): [Thread!]
        threadsPage: Thread!
        threadsMain: [Thread]
    }   

    input InputsMain{
        name: String!
        description: String!
    }

    input UpdateMain{
        name: String
        sub_name: String
        description: String
    }

    type User{
        id: ID!
        id_user: String!
        username: String!
        email: String!
        password: String!
        created_at: String!
        deleted: Boolean
        id_chat: String!
        threads: [Thread!]
        main: [Main!]
        chat: [Chat!]
        message: Message!
    }

    input InputsUser{
        username: String!
        email: String!
        password: String!
    }

    input UpdateInputsUser{
        username: String
        email: String
        password: String
    }

    type Admin{
        id: ID!
        username: String!
        password: String!
    }

    type FriendshipStatus{
        id_friendship: String!
        id_requested: String!
        id_addressed: String!
        specifiedtime: String!
        status: String!
        id_specifier: String!
        users: User
    }

    type Thread{
        id_thread: String!
        name: String!
        subject: String!
        created_at: String!
        id_user: String
        existing_user: Boolean
        upvote: Int
        downvote: Int
        thread_message: String!
        users_delete: String
        id_main: String!
        users: User!
        posts: [Post]
        postsThread: [Post]
        usersThread: User!
    }

    input InputThread{
        name: String!
        subject: String!
        thread_message: String!
        id_main: String!
    }

    input UpdateThread{
        id_thread: String!
        name: String
        subject: String
        upvote: Int
        downvote: Int
    }

    type Vote{
        id_vote: String!
        id_user: String!
        id_thread: String!
        status_vote: String!
        created: String!
        threads: Thread
    }

    type Post{
        id_message: String
        message: String!
        created_at: String!
        updated_at: String!
        id_user: String!
        id_thread: String!
        user: User!
    }

    input InputsPost{
        message: String!
        id_thread: String
    }

    type UserChat{
        id_user: String!
    }

    type Chat{
        id_chat: String!
        name: String!
        created_at: String!
        id_user: String!
        list: [String!]
        users: [User!]
    }

    input InputCreateChats{
        name: String!
        list: [String!]
    }

    type Message{
        id_message: String!
        message: String!
        created_at: String!
        id_chat: String!
        id_user: String!
        username: String!
    }

    type Query{
        readMain: [Main!]
        readAllMain: [Main!]
        readMainName(name: String!): [Main!]
        getSingleMain(id_main: String!): Main
        users: [User!]
        profile: User!
        userProfile(id: String!): User!
        readThread: [Thread!]
        readSingleThread(id: String!): Thread!
        readVote: [Vote!]
        readPost(id: String!): [Post!]
        readFriends: [User!]
        readNotification: [FriendshipStatus!]
        getCookies: Boolean
        waiting(id_addressed: String!): Boolean!
        readChat: User!
        readAllChats: [Chat!]
        readSingleChat(id_chat: String!): [Chat!]
        readMessages(id_chat: String!): [Message]
    }

    type Mutation{
        createMain(inputsMain: InputsMain): Main!
        joinMain(id: String!): Main!
        removeMain(id: String!): Main!
        deleteMain(id: ID!): Main!
        updateMain(id: ID! updateMain: UpdateMain): Main!
        registration(inputsUser: InputsUser): User!
        updateUser(updateInputsUser: UpdateInputsUser): User
        updateSetting(updateInputsUser: UpdateInputsUser): User
        deleteUser: User!
        banUser(id: ID!): User!
        createThread(inputThread: InputThread): Thread!
        updateThread(updateThread: UpdateThread): Thread!
        addVote(id_thread: String!): Vote!
        removeVote(id_thread: String!): Vote!
        updateVote(id_thread: String!, status_vote: String!): Vote!
        restoreVote(id_thread: String!, status_vote: String!): Vote!
        createPost(inputsPost: InputsPost): Post!
        deletePost(id_message: ID!): Post!
        updatePost(id_message: ID! inputsPost: InputsPost): Post!
        sendFriendship(id_addressed: String!): FriendshipStatus!
        updateFriendshipStatus(id_friendship: String, status: String!): FriendshipStatus!
        createChat(inputCreateChats: InputCreateChats): [Chat!]
        sendMessage(message: String!, id_chat: String!): Message!
        login(email: String! password: String!): User!
        logout: Boolean!
    }

    type Subscription{
        newPost: Post!
        newMessage(id_chat: String!): Message!
    }

    schema{
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
`;