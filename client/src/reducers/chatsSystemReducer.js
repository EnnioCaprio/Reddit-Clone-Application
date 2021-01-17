const chatsSystemReducer = (state, action) => {
    switch(action.type){
        case 'GET_CHAT':
            return action.data
        case 'ADD_CHAT':
            return [
                ...state,
                {
                    id_chat: action.data.id_chat,
                    name: action.data.name,
                    id_user: action.data.id_user,
                    list: action.data.list
                }
            ]
        default: 
        return state
    }
}

export {chatsSystemReducer as default}