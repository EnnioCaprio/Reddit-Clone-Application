import React, {createContext, useState, useEffect} from 'react';
import {GET_COOKIES} from '../queries/tokensQueries';
import {print} from 'graphql';
import axios from 'axios';

export const TokensContext = createContext();

export const TokensProvider = (props) => {

    const URL = process.env.REACT_APP_URL;
    
    const [ok, setOk] = useState(undefined);

    const [auth, setAuth] = useState(undefined);

    useEffect(() => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(GET_COOKIES)
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            if(res.data.data.getCookies === true){
                setAuth(true);
            }else{
                setAuth(false)
            }
        })
        .catch(err => console.log(err))
    }, [ok])

    return(
        <TokensContext.Provider value={{a: [auth, setAuth], o: [ok, setOk]}}>
            {props.children}
        </TokensContext.Provider>
    )
}