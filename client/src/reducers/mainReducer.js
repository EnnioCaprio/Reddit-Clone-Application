const mainReducer = (state, action) => {
    switch(action.type){
        case 'GET_MAIN':
            return action.data
        case 'ADD_MAIN':
            return state.id_main === action.id_main ? {...state, subscribed_users: [].concat(action.users)} : state
        case 'REMOVE_MAIN':
            return state.id_main === action.id_main ? {...state, subscribed_users: [].concat(action.users)} : state
        default:
            return state
    }
}

export {mainReducer as default}