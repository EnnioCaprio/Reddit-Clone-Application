const otherUsersReducer = (state, action) => {
    switch(action.type){
        case 'GET_OTHER_USERS':
            return action.data
        default:
            return state
    }
}

export {otherUsersReducer as default}