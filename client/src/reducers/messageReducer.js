const messageReducer = (state, action) => {
    switch(action.type){
        case 'GET_MESSAGES':
            return action.data
        case 'SEND_MESSAGE':
            return [
                ...state,
                {
                    username: action.username,
                    id_message: action.id_message,
                    message: action.message,
                    created_at: action.created_at
                }
            ]
        default:
            return state;
    }
}

export {messageReducer as default}