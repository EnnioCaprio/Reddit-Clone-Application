const notificationReducer = (state, action) => {
    switch(action.type){
        case 'GET_NOTIFICATION': 
            return action.data
        case 'ADD_NOTIFICATION':
            return [
                ...state,
                {
                    id_requested: action.id_requested,
                    id_friendship: action.id_friendship,
                    id_addressed: action.id_addressed,
                    status: action.status,
                    id_specifier: action.id_specifier,
                    specifiedtime: action.specifiedtime,
                    users: {
                        id_user: action.id_user,
                        username: action.username
                    }
                }
            ]
        case 'REMOVE_NOTIFICATION':
            return state.filter(s => s.id_friendship[0] === action.id_friendship)
        default:
            return state
    }
}

export {notificationReducer as default}