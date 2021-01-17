const listUsersReducer = (state, action) => {
    switch(action.type){
        case 'ADD_USER':
            return[
                ...state,
                {
                    id_user: action.id_user,
                    username: action.username
                }
            ]
        case 'REMOVE_USER':
            return state.filter(s => s.id_user !== action.id_user);
        case 'RESTART_LIST':
            return action.data;
        default:
            return state
    }
}

export {listUsersReducer as default}