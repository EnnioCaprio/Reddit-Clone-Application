import React, {useEffect, Fragment, useState, useContext} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Posts from './Posts';
import axios from 'axios';
import { ThreadContext } from '../context/ThreadContext';
import { ThreadVoteContext } from '../context/ThreadVoteContext';
import { ProfileContext } from '../context/ProfileContext';
import { PostsThreadsContext } from '../context/PostsThreadsContext';
import { TokensContext } from '../context/TokensContext';
import { MainContext } from '../context/MainContext';
import { HeaderContext } from '../context/HeaderContext';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { postSubscription } from '../subscriptions/PostSubscriptions';
import { GET_SINGLE_THREAD } from '../queries/threadQueries';
import { CREATE_POST, DELETE_POST, GET_POST, UPDATE_POST } from '../queries/postQueries';
import Vote from '../handlerComponents/Vote';
import Join from '../handlerComponents/Join';
import { print } from 'graphql';
import { formatUser } from '../handler';

const Threads = (props) => {
    const [profile,] = useContext(ProfileContext);

    const [threads, dispatchThreads] = useContext(ThreadContext);

    const {v, c, b} = useContext(ThreadVoteContext);

    const [votes,] = v;

    const [call, setCall] = c;

    const [buttonLoading, setButtonLoading] = b;

    const [updateJoin, setUpdateJoin] = useState(undefined);

    const [main, dispatchMain] = useContext(MainContext);

    const {l, s, p} = useContext(HeaderContext);

    const [, setSign] = s;

    const [, setLogin] = l;

    const [place, setPlace] = p;

    const location = useLocation();

    const { data, loading, error } = useSubscription(postSubscription);

    useEffect(() => {
        if(!loading && data){
            dispatchPosts({
                type: 'CREATE_POSTS',
                id_message: data.newPost.id_message,
                id_user: data.newPost.id_user,
                message: data.newPost.message,
                created_at: data.newPost.created_at,
                username: profile.username
            })
        }
    }, [loading, data])

    const [createPosts] = useMutation(CREATE_POST, {fetchPolicy: 'no-cache'});

    const [loadingData, setLoadingData] = useState(true);

    const [message, setMessage] = useState('');

    const [posts, dispatchPosts] = useContext(PostsThreadsContext);

    let dataThread = props.location.state || JSON.parse(localStorage.getItem('thread'));
    
    let {dataThread: {id_main, name, description, created_at, users}} = dataThread;

    const {a} = useContext(TokensContext);

    const { id } = useParams();

    const [auth,] = a;

    const URL = process.env.REACT_APP_URL;

    let source = axios.CancelToken.source();

    useEffect(() => {
        if(auth || buttonLoading){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(GET_SINGLE_THREAD),
                    variables: {
                        id
                    }
                },
                headers: {
                    'Content-Type' : 'application/json'
                },
                cancelToken: source.token
            })
            .then(res => {
                 dispatchThreads({
                    type: 'GET_THREADS',
                    data: res.data.data.readSingleThread
                })
            })
            .catch(err => console.log(err))

            return () => {
                setTimeout(() => {
                    source.cancel('removed token');
                }, 1000)
            }
        }
    }, [auth, buttonLoading])

    useEffect(() => {
        setPlace(main.name);
    }, [location.pathname])

    useEffect(() => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(GET_POST),
                variables: {
                    id
                }
            },
            headers: {
                'Content-Type' : 'application/json' 
            }
        })
        .then(res => {
            dispatchPosts({
                type: 'GET_POSTS',
                data: res.data.data.readPost
            })
            setLoadingData(false);
        })
        .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        const getJoin = async () => {
            const response = await Join.handlesGet(id_main);

            dispatchMain({
                type: 'GET_MAIN',
                data: response.data.data.getSingleMain
            })
        }

        getJoin();
        
    }, [auth, updateJoin])

    const joinMain = async () => {
        const res = await Join.handlesJoin(id_main);

        dispatchMain({
            type: 'ADD_MAIN',
            id_main: res.data.data.joinMain.id_main,
            users: res.data.data.joinMain.subscribed_users
        })

        setUpdateJoin(!updateJoin);
    }

    const removeMain = async () => {
        const res = await Join.handlesNotJoin(id_main);

        dispatchMain({
            type: 'REMOVE_MAIN',
            id_main: res.data.data.removeMain.id_main,
            users: res.data.data.removeMain.subscribed_users
        })

        setUpdateJoin(!updateJoin);
    }

    const createPost = () => {
        if(message){
            createPosts({
                variables: {
                    message,
                    id_thread: id
                }
            })
        }

        setMessage('');
    }

    const updatePost = (message, id_message) => {
        if(message){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(UPDATE_POST),
                    variables: {
                        id_message,
                        message
                    }
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            .then(res => {
                dispatchPosts({
                    type: 'UPDATE_POSTS',
                    id_message: res.data.data.updatePost.id_message,
                    message
                })
            })
        }else{
            console.log('errors')
        }
    }

    const deletePost = (id_message) => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(DELETE_POST),
                variables: {
                    id_message
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            dispatchPosts({
                type: 'DELETE_POSTS',
                id_message: res.data.data.deletePost.id_message
            })
        })
        .catch(err => console.log(err))
    }

    const addVote = (id) => {
        setButtonLoading(true);

        Vote.handlesAdd(id);

        setTimeout(() => {
            setButtonLoading(false);
        }, 100)
        setCall(!call);
    }

    const removeVote = (id) => {
        setButtonLoading(true);

        Vote.handlesRemove(id);

        setTimeout(() => {
            setButtonLoading(false);
        }, 100)
        setCall(!call)
    }

    const updateVote = (id, vote) => {
        setButtonLoading(true);

        Vote.handlesUpdate(id, vote);

        setTimeout(() => {
            setButtonLoading(false);
        }, 100)
        setCall(!call)
    }

    const restoreVote = (id, vote) => {
        setButtonLoading(true);

        Vote.handlesBack(id, vote);

        setTimeout(() => {
            setButtonLoading(false);
        }, 100)
        setCall(!call)
    }

    if(loadingData){
        return(
            <div className="loading">
                <span className="loading-spinners"></span>
            </div>
        )
    }

    return(
        <div className="container-thread">
           {<div className="container-threadcopy">
                <div className="container-thread__dashboard">
                    <ul className="container-thread__dashboard__list">
                        <li>
                            {
                                votes && votes.some(v => v.status_vote === 'upvote' && v.id_thread === threads.id_thread) ?
                                <FontAwesomeIcon icon={faArrowUp} style={{color: 'blue'}} onClick={() => {
                                    !buttonLoading && restoreVote(threads.id_thread, 'neutral')
                                }} />
                                :
                                votes && votes.some(v => (v.status_vote === 'downvote' || v.status_vote === 'neutral') && v.created === 'true' && v.id_thread === threads.id_thread) ?
                                    <FontAwesomeIcon icon={faArrowUp} style={{color: 'red'}} onClick={() => {
                                        !buttonLoading && updateVote(threads.id_thread, 'upvote')
                                    }} />
                                        :
                                    <FontAwesomeIcon icon={faArrowUp} onClick={() => {
                                        !buttonLoading && addVote(threads.id_thread)
                                    }} />
                            }
                        </li>
                        <li>
                            {JSON.stringify(threads.upvote + threads.downvote)}
                        </li>
                        <li>
                            {
                            votes && votes.some(v => v.status_vote === 'downvote' && v.id_thread === threads.id_thread) ?
                            <FontAwesomeIcon icon={faArrowDown} style={{color: 'blue'}} onClick={() => {
                                !buttonLoading && restoreVote(threads.id_thread, 'neutral')
                            }} />
                            :
                            votes && votes.some(v => (v.status_vote === 'upvote' || v.status_vote === 'neutral') && v.created === 'true' && v.id_thread === threads.id_thread) ?
                                <FontAwesomeIcon icon={faArrowDown} style={{color: 'red'}} onClick={() => {
                                    !buttonLoading && updateVote(threads.id_thread, 'downvote')
                                }} />
                                    :
                                <FontAwesomeIcon icon={faArrowDown} onClick={() => {
                                    !buttonLoading && removeVote(threads.id_thread)
                                }} />
                            }
                        </li>
                        <li>{name}</li>
                    </ul>
                </div>
                <div className="container-thread__sub">
                    <div className="container-thread__sub__main">
                        <div className="container-thread__sub__main__author">
                            <div className="container-thread__sub__main__author__votes">
                                
                            </div>
                            <div className="container-thread__sub__main__author__first">
                                <div className="container-thread__sub__main__author__first__info">
                                    {
                                        users.deleted ? <p>r/{name} - Posted by deleted</p> : <p>r/{name} - Posted by {users.username}</p>
                                    }
                                </div>
                                <div className="container-thread__sub__main__author__first__title">
                                    <h2>{threads.name}</h2>
                                </div>
                                <div className="container-thread__sub__main__author__first__message">
                                    {threads.thread_message}
                                </div>
                                <div className="container-thread__sub__main__author__first__other">
                                    <h6>Comments {posts.length}</h6>
                                </div>
                                <div className={!auth ? "container-thread__sub__main__author__first__log" : "container-thread__sub__main__author__first__logged"}>
                                {
                                    !auth ?
                                    <Fragment>
                                        <div className="container-thread__sub__main__author__first__log__string">
                                            <h3>Log in or sign up to leave a comment</h3>
                                        </div>
                                        <div className="container-thread__sub__main__author__first__log__buttons">
                                            <button onClick={() => setLogin(true)}>Log In</button>
                                            <button onClick={() => setSign(true)}>Sign up</button>
                                        </div>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <span>Commented as user</span>
                                        <div className="container-thread__sub__main__author__first__log__create">
                                            <textarea 
                                            value={message || ''}
                                            onChange={(e) => setMessage(e.target.value)} placeholder="message"
                                            />
                                            <button onClick={createPost}>Create Post</button>
                                        </div> 
                                    </Fragment>
                                }
                                </div>
                            </div>
                        </div>
                        {
                            posts.map(p => (
                                <Posts 
                                    key={p.id_message}
                                    value={p}
                                    main={name}
                                    auth={auth}
                                    update={updatePost}
                                    deleteP={deletePost}
                                />
                            ))
                        }
                    </div>
                    <div className="container-thread__sub__side">
                    <div className={auth ? "container-thread__sub__side__thread" : "container-thread__sub__side__none"}>
                        <div className="container-thread__sub__side__thread__background">
                            <div>
                                <h4>About community</h4>
                            </div>
                        </div>
                        <div className="container-thread__sub__side__thread__info">
                            <div className="container-thread__sub__side__thread__info__cut" style={!auth ? {gridTemplateRows: "100%"} : {gridTemplateRows: "70% 30%"}}>
                                <div className="container-thread__sub__side__thread__info__cut__detail">
                                    <div className="container-thread__sub__side__thread__info__cut__detail__title">
                                        <h3>r/{name}</h3>
                                    </div>
                                    <div className="container-thread__sub__side__thread__info__cut__detail__description">
                                        <h4>{description}</h4>
                                    </div>
                                    <div className="container-thread__sub__side__thread__info__cut__detail__other">
                                        <div>
                                            <h4>{main.subscribed_users ? main.subscribed_users.length : 0} members</h4>
                                        </div>
                                        <div>
                                            <p>Created at <br />{formatUser(created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                                {
                                    auth &&
                                    <div className="container-thread__sub__side__thread__info__cut__join">
                                        <div className="container-thread__sub__thread__info__cut__join__button">
                                        {
                                            main.subscribed_users && main.subscribed_users.includes(profile.id_user) ?
                                            <button onClick={() => removeMain()}>JOINED</button>
                                            :
                                            <button onClick={() => joinMain()}>JOIN</button>
                                        }   
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
                    
                    } 
        </div>
    )
}

export {Threads as default}