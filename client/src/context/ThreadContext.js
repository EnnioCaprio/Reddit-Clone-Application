import React, {createContext, useReducer} from 'react';
import threadsReducer from '../reducers/threadsReducer';

export const ThreadContext = createContext();

export const ThreadProvider = (props) => { 
    const [threads, dispatchThreads] = useReducer(threadsReducer, []);

    return(
        <ThreadContext.Provider value={[threads, dispatchThreads]}>
            {props.children}
        </ThreadContext.Provider>
    )
}