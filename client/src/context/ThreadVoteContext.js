import React, {createContext, useEffect, useReducer, useState, useContext} from 'react';
import {GET_VOTE} from '../queries/homeQueries';
import {TokensContext} from '../context/TokensContext';
import threadVoteReducer from '../reducers/threadVoteReducer';
import {print} from 'graphql';
import axios from 'axios';

export const ThreadVoteContext = createContext();

export const ThreadVoteProvider = ({children}) => {
    const {a} = useContext(TokensContext);

    const [auth, setAuth] = a;

    const [votes, dispatchVotes] = useReducer(threadVoteReducer, undefined);

    const [call, setCall] = useState(undefined);

    const [buttonLoading, setButtonLoading] = useState(false);

    const URL = process.env.REACT_APP_URL;

    useEffect(() => {
        let source = axios.CancelToken.source();

        setButtonLoading(true);
        
        if(auth){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(GET_VOTE)
                },
                headers: {
                    'Content-Type' : 'application/json'
                },
                withCredentials: true,
                cancelToken: source.token
            })
            .then(res => {
                dispatchVotes({
                    type: 'GET_VOTE',
                    data: res.data.data.readVote
                })
            })
            .catch(err => console.log(err))
            setButtonLoading(false);
        }else{
            dispatchVotes({
                type: 'REMOVE_VOTE'
            })
        }

        return () => {
            source.cancel('removed');
        }
    }, [call, auth])

    return(
        <ThreadVoteContext.Provider value={{v: [votes, dispatchVotes], c: [call, setCall], b: [buttonLoading, setButtonLoading]}}>
            {children}
        </ThreadVoteContext.Provider>
    )
}