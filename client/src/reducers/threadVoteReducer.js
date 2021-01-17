const threadVoteReducer = (state, action) => {
    switch(action.type){
        case 'GET_VOTE':
            return action.data
        case 'REMOVE_VOTE':
            return []
        default:
            return state
    }
}

export {threadVoteReducer as default}