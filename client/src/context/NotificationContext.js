import React, {createContext, useReducer, useEffect, useContext} from 'react';
import notificationReducer from '../reducers/notificationReducer';
import {GET_NOTIFICATION} from '../queries/notificationQueries';
import {print} from 'graphql';
import {TokensContext} from './TokensContext';
import axios from 'axios';

export const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
    const [notification, dispatchNotification] = useReducer(notificationReducer, []);

    const {a,} = useContext(TokensContext);

    const [auth,] = a;

    const URL = process.env.REACT_APP_URL;

    useEffect(() => {
        if(auth){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(GET_NOTIFICATION)
                },
                headers:{
                    'Content-Type' : 'application/json'
                },
                withCredentials: true
            })
            .then(res => {
                dispatchNotification({
                    type: 'GET_NOTIFICATION',
                    data: res.data.data.readNotification
                })
            })
            .catch(err => console.log(err))
        }else{
            console.log('cannot load');
        }
    }, [auth])

    return(
        <NotificationContext.Provider value={[notification, dispatchNotification]}>
            {children}
        </NotificationContext.Provider>
    )
}