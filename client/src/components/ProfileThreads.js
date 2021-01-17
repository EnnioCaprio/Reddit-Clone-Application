import React, {Fragment, useContext} from 'react';
import OverviewThread from './OverviewThread';
import PostsThreads from './PostsThreads';
import {ThreadContext} from '../context/ThreadContext';
import {UPDATE_THREAD} from '../queries/threadQueries';
import {print} from 'graphql';
import axios from 'axios';

const ProfileThreads = ({value, id_user, username, currentDash, main}) => {
    const [, dispatchThreads] = useContext(ThreadContext);

    const URL = process.env.REACT_APP_URL;

    const updateThread = () => {

        const name = prompt('insert name here');

        if(name){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(UPDATE_THREAD),
                    variables: {
                        id_thread: value.id_thread,
                        name: name,
                        subject: name
                    }
                },
                headers: {
                    'Content-Type' : 'application/json'
                },
                withCredentials: true
            })
            .then(res => {
                dispatchThreads({
                    type: 'UPDATE_THREADS',
                    id_thread: res.data.data.updateThread.id_thread,
                    name: res.data.data.updateThread.name,
                    subject: res.data.data.updateThread.subject
                })
            })
            .catch(err => console.log(err))
        }else{
            console.log('Error');
        }
    }

    return(
        <Fragment>
            {
                currentDash === 'Overview' ? 
                    <OverviewThread
                        value={value}
                        id_user={id_user}
                        username={username}
                        updateThread={updateThread}
                        main={main}
                    />
                : 
                    <PostsThreads 
                        value={value}
                        username={username}
                        updateThread={updateThread}
                        currentDash={currentDash}
                        id_user={id_user}
                        main={main}
                    />
            }
        </Fragment>
    )
}

export {ProfileThreads as default}