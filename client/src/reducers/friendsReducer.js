const friendsReducer = (state, action) => {
    switch(action.type){
        case 'GET_FRIENDS':
            return action.data
        default:
            return state
    }
}

export {friendsReducer as default}