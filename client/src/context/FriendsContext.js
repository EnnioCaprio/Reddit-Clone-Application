import React, {createContext, useEffect, useReducer, useContext} from 'react';
import friendsReducer from '../reducers/friendsReducer';
import {TokensContext} from '../context/TokensContext';
import {NotificationContext} from '../context/NotificationContext';
import {GET_FRIENDS} from '../queries/profileQueries';
import axios from 'axios';
import {print} from 'graphql';

export const FriendsContext = createContext();

export const FriendsProvider = ({children}) => {
    const [friends, dispatchFriends] = useReducer(friendsReducer, []);

    const {a,} = useContext(TokensContext);

    const [notification,] = useContext(NotificationContext);

    const [auth,] = a;

    const URL = process.env.REACT_APP_URL;

    let source = axios.CancelToken.source();

    useEffect(() => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(GET_FRIENDS)
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true,
            cancelToken: source.token
        })
        .then(res => {
            dispatchFriends({
                type: 'GET_FRIENDS',
                data: res.data.data.readFriends
            });
        })
        .catch(err => console.log(err))

        return () => {
            setTimeout(() => {
                source.cancel('removed token')
            }, 1000)
        }
    }, [auth, notification])

    return(
        <FriendsContext.Provider value={[friends, dispatchFriends]}>
            {children}
        </FriendsContext.Provider>
    )
}