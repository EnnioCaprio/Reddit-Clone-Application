import React, {Fragment, useContext, useReducer, useState, useEffect} from 'react';
import Profile from '../components/Profile';
import otherUsersReducer from '../reducers/otherUsersReducer';
import {ProfileContext} from '../context/ProfileContext';
import {ThreadContext} from '../context/ThreadContext';
import {GET_OTHERS, GET_PROFILE} from '../queries/profileQueries';
import {print} from 'graphql';
import axios from 'axios';

const Profiles = (props) => {
    const [otherUsers, dispatchOtherUsers] = useReducer(otherUsersReducer, []);

    const [loading, setLoading] = useState(true);

    const [profile,] = useContext(ProfileContext);

    const [threads, dispatchThreads] = useContext(ThreadContext);

    const userId = props.match.params.id;

    useEffect(() => {
        const URL = process.env.REACT_APP_URL;

        axios({
            url: URL,
            method: 'POST',
            data: profile.id_user === userId ? 
            {
                query: print(GET_PROFILE)
            }
            :
            {
                query: print(GET_OTHERS),
                variables: {
                    id: userId
                }
            },
            headers: {
                'Content-Type' : 'application/json',
            },
            withCredentials: true
        })
        .then(res => {
            if(profile.id_user === userId){
                dispatchThreads({
                    type: 'GET_THREADS',
                    data: res.data.data.profile.threads
                })
            }else{
                dispatchOtherUsers({
                    type: 'GET_OTHER_USERS',
                    data: res.data.data.userProfile
                })
                dispatchThreads({
                    type: 'GET_THREADS',
                    data: res.data.data.userProfile.threads
                })
            }
            setLoading(false)
        })
        .catch(err => console.log(err))
    }, [])

    if(loading){
        return(
            <div className="loading">
                <span className="loading-spinners"></span>
            </div>
        )
    }

    return(
        <Fragment>  
            {
                <Profile
                    threads={threads}
                    otherUsers={profile.id_user !== userId ? otherUsers : ''}
                    userId={userId}
                />
            }
        </Fragment>
    )
}

export {Profiles as default}