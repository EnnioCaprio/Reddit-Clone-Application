const postsReducer = (state, action) => {
    switch(action.type){
        case 'GET_POSTS':
            return action.data
        case 'CREATE_POSTS':
            return [
                ...state,
                {
                    id_message: action.id_message,
                    id_user: action.id_user,
                    message: action.message,
                    created_at: action.created_at,
                    user: {
                        id_user: action.id_user,
                        username: action.username
                    }
                }
            ]
        case 'UPDATE_POSTS':
            return state.map(s => s.id_message === action.id_message ? {...s, message: action.message} : s);
        case 'DELETE_POSTS':
            return state.filter(s => s.id_message !== action.id_message);
        default:
            return state
    }
}

export {postsReducer as default}