import React, {createContext, useReducer, useContext, useEffect} from 'react';
import chatSystemReducer from '../reducers/chatSystemReducer';
import chatsSystemReducer from '../reducers/chatsSystemReducer';
import {TokensContext} from './TokensContext';
import axios from 'axios';

export const ChatSystemContext = createContext();

export const ChatSystemProvider = ({children}) => {
    const [openChat, dispatchOpenChat] = useReducer(chatSystemReducer, undefined);

    const {a} = useContext(TokensContext);

    const [chats, dispatchChats] = useReducer(chatsSystemReducer, []);

    const [auth,] = a;

    const URL = process.env.REACT_APP_URL;

    const GET_CHAT = {
        query: `
            query readAllChats{
                readAllChats{
                    id_chat,
                    name,
                    id_user,
                    list
                }
            }
        `
    };

    useEffect(() => {
        axios({
            url: URL,
            method: 'POST',
            data: GET_CHAT,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            console.log(res);
            if(res.data.data){
                dispatchChats({
                    type: 'GET_CHAT',
                    data: res.data.data.readAllChats
                })
            }else{
                dispatchChats({
                    type: 'GET_CHAT',
                    data: []
                })
            }
        })
        .catch(err => console.log(err))
    }, [auth])

    useEffect(() => {
        dispatchOpenChat({
            type: 'CLOSE_CHAT',
            data: false
        })
    }, [auth])

    return(
        <ChatSystemContext.Provider value={{oc: [openChat, dispatchOpenChat], c: [chats, dispatchChats]}}>
            {children}
        </ChatSystemContext.Provider>
    )
}