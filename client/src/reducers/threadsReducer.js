const threadsReducer = (state, action) => {
    switch(action.type){
        case 'CREATE_THREADS':
            return [
                ...state,
                {
                    id_main: action.id_main,
                    name: action.name,
                    description: action.description,
                    members: action.members,
                    threadsPage: {
                        id_thread: action.id_thread,
                        name: action.title,
                        subject: action.message,
                        usersThread: {
                            id_user: action.id_user,
                            username: action.username
                        }
                    }
                }
            ]
        case 'UPDATE_THREADS':
            return state.map(s => s.id_thread === action.id_thread ? {...s, name: action.name, subject: action.subject} : s)
        case 'UPDATE_VOTE': 
            return state.map(s => s.id_thread === action.id_thread ? {...s, upvote: action.upvote, downvote: action.downvote} : s)
        case 'GET_THREADS':
            return action.data
        default:
            return state
    }
}

export {threadsReducer as default}