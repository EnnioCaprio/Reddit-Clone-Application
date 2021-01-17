const userReducer = (state, action) => {
    switch(action.type){
        case 'GET_PROFILE':
            return action.data
        case 'UPDATE_PROFILE':
            return state.id_user === action.id_user ? {...state, username: action.username} : state
        case 'UPDATE_EMAIL':
            return state.id_user === action.id_user ? {...state, email: action.email} : state
        default:
            return state
    }
}

export {userReducer as default}