import React, {createContext, useReducer, useEffect} from 'react';
import postsReducer from '../reducers/postsReducer';

export const PostsThreadsContext = createContext();

export const PostsThreadsProvider = (props) => {

    const [posts, dispatchPosts] = useReducer(postsReducer, []);

    return(
        <PostsThreadsContext.Provider value={[posts, dispatchPosts]}>
            {props.children}
        </PostsThreadsContext.Provider>
    )

}