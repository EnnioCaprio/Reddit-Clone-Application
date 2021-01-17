const chatSystemReducer = (state, action) => {
    switch(action.type){
        case 'GET_OPEN':
            return action.data
        case 'CLOSE_CHAT':
            return action.data
        default:
            return state
    }
}

export {chatSystemReducer as default}