import React, {createContext, useReducer, useEffect, useContext} from 'react';
import userReducer from '../reducers/userReducer';
import {GET_PROFILE_FIRST} from '../queries/profileQueries';
import {print} from 'graphql';
import {TokensContext} from '../context/TokensContext';
import axios from 'axios';

export const ProfileContext = createContext();

export const ProfileProvider = (props) => {
    const [profile, dispatchProfile] = useReducer(userReducer, []);

    const {a} = useContext(TokensContext);

    const [auth,] = a;

    const URL = process.env.REACT_APP_URL;

    useEffect(() => {
        if(auth){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(GET_PROFILE_FIRST)
                },
                headers: {
                    'Content-Type' : 'application/json',
                },
                withCredentials: true
            })
            .then(res => {
                dispatchProfile({
                    type: 'GET_PROFILE',
                    data: res.data.data.profile
                })
            })
            .catch(err => console.log(err))
        }
    }, [auth])

    return(
        <ProfileContext.Provider value={[profile, dispatchProfile]}>
            {props.children}
        </ProfileContext.Provider>
    )
}
