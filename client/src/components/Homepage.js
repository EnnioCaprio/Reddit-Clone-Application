import React, { useContext, useEffect, Fragment, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Community from './Community';
import ModelLogin from './ModelLogin';
import ModelSignup from './ModelSignup';
import Vote from '../handlerComponents/Vote';
import { ThreadVoteContext } from '../context/ThreadVoteContext';
import { ThreadContext } from '../context/ThreadContext';
import { HeaderContext } from '../context/HeaderContext';
import { TokensContext } from '../context/TokensContext';
import { GET_THREADS } from '../queries/homeQueries';
import { changeFormat } from '../handler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faLink } from '@fortawesome/free-solid-svg-icons';
import { print } from 'graphql';
import axios from 'axios';

const Homepage = () => {
    const {l, s, p} = useContext(HeaderContext);

    const [login,] = l;

    const [signup,] = s;

    const [place, setPlace] = p;

    const {a} = useContext(TokensContext);

    const [auth,] = a;

    const [loading, setLoading] = useState(true);

    const [threads, dispatchThreads] = useContext(ThreadContext);

    const {v, c, b} = useContext(ThreadVoteContext);

    const [votes,] = v;

    const [call, setCall] = c;

    const [buttonLoading, setButtonLoading] = b;

    const [currentFilter, setCurrentFilter] = useState('New'); 

    const history = useHistory();

    const location = useLocation();

    const URL = process.env.REACT_APP_URL;

    let source = axios.CancelToken.source();

    useEffect(() => {
        if(auth || buttonLoading){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(GET_THREADS)
                },
                headers: {
                    'Content-Type' : 'application/json' 
                },
                cancelToken: source.token
            })
            .then(res => {
                    dispatchThreads({
                        type: 'GET_THREADS',
                        data: res.data.data.readAllMain
                    })
                setLoading(false);
            })
            .catch(err => console.log(err));

            return () => {
                setTimeout(() => {
                    source.cancel('removed token')
                }, 1000)
            }
        }
    }, [auth, buttonLoading])

    useEffect(() => {
        setPlace('homepage');
    }, [location.pathname])

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

    if(loading){
        return(
            <div className="loading">
                <span className="loading-spinners"></span>
            </div>
        )
    }

    const reduceMain = () => {
        let mainId = threads.map(m => ({
            id_main: m.id_main,
            name: m.name
        }));

        mainId = mainId.filter((main, index, self) =>
            index === self.findIndex((m) => (
                m.id_main === main.id_main
            ))
        )

        return mainId
    }

    const compare = (a, b) => {
        if(currentFilter === 'New'){
            if (a.threadsPage.created_at < b.threadsPage.created_at){
                return 1;
            }
              if (a.threadsPage.created_at > b.threadsPage.created_at){
                return -1;
            } 
        }else if(currentFilter === 'Top'){
            if (a.threadsPage.upvote < b.threadsPage.upvote){
                return 1;
            }
              if (a.threadsPage.upvote > b.threadsPage.upvote){
                return -1;
            }
        }
        return 0;
    }

    const sortedThreads = threads.map(t => t).sort(compare);

    const saveLocalStorage = (name, description, subscribed_users, created_at, users) => {
        const dataForm = {
            dataThread: {
                name,
                description,
                subscribed_users,
                created_at,
                users
            }
        }

        localStorage.setItem('thread', JSON.stringify(dataForm));
    }

    return(
        <Fragment>
            {
                login === true ? <ModelLogin /> : signup === true ? <ModelSignup /> : ''
            }
            <div className="container">
                <div className="container-centered">
                    <div className="container-main">
                        <div className="container-main__section">
                            {
                                auth &&
                                <div className="container-main__create__thread">
                                    <div className="container-main__create__thread__cut">
                                        <div className="container-main__create__thread__user">
                                            <span></span>
                                        </div>    
                                        <div className="container-main__create__thread__input">
                                            <input type="text" placeholder="write a post" onClick={() => {
                                                history.push({
                                                    pathname: "/createPost"
                                                });
                                            }}/>
                                        </div>
                                        <div className="container-main__create__thread__list">
                                            <ul>
                                                <li>
                                                    <FontAwesomeIcon icon={faLink} />
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="container-main__search__for">
                                <ul>
                                    <li className={currentFilter === 'New' ? 'current' : ''} onClick={() => setCurrentFilter('New')}>New</li>
                                    <li className={currentFilter === 'Top' ? 'current' : ''} onClick={() => setCurrentFilter('Top')}>Top</li>
                                </ul>
                                <div>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="container-main__threads">
                            {
                                sortedThreads.map(t => (
                                    <div key={t.threadsPage.id_thread} className="container-main__threads__thread">
                                        <div className="container-main__threads__thread__vote">
                                            <div className="container-main__threads__thread__vote__elements">
                                                <ul>
                                                    <li>
                                                        {
                                                            votes && votes.some(v => v.status_vote === 'upvote' && v.id_thread === t.threadsPage.id_thread) ?
                                                            <FontAwesomeIcon icon={faArrowUp} style={{color: 'blue'}} onClick={() => {
                                                                !buttonLoading && restoreVote(t.threadsPage.id_thread, 'neutral')
                                                            }} />
                                                            :
                                                            votes && votes.some(v => (v.status_vote === 'downvote' || v.status_vote === 'neutral') && v.created === 'true' && v.id_thread === t.threadsPage.id_thread) ?
                                                                <FontAwesomeIcon icon={faArrowUp} style={{color: 'red'}} onClick={() => {
                                                                    !buttonLoading && updateVote(t.threadsPage.id_thread, 'upvote')
                                                                }} />
                                                                :
                                                                <FontAwesomeIcon icon={faArrowUp} onClick={() => {
                                                                    !buttonLoading && addVote(t.threadsPage.id_thread)
                                                                }} />
                                                        }
                                                    </li>
                                                    <li>
                                                        <b>{t.threadsPage.upvote + t.threadsPage.downvote}</b>
                                                    </li>
                                                    <li>
                                                        {
                                                            votes && votes.some(v => v.status_vote === 'downvote' && v.id_thread === t.threadsPage.id_thread) ?
                                                            <FontAwesomeIcon icon={faArrowDown} style={{color: 'blue'}} onClick={() => {
                                                                !buttonLoading && restoreVote(t.threadsPage.id_thread, 'neutral')
                                                            }} />
                                                            :
                                                            votes && votes.some(v => (v.status_vote === 'upvote' || v.status_vote === 'neutral') && v.created === 'true' && v.id_thread === t.threadsPage.id_thread) ?
                                                                <FontAwesomeIcon icon={faArrowDown} style={{color: 'red'}} onClick={() => {
                                                                    !buttonLoading && updateVote(t.threadsPage.id_thread, 'downvote')
                                                                }} />
                                                                    :
                                                                <FontAwesomeIcon icon={faArrowDown} onClick={() => {
                                                                    !buttonLoading && removeVote(t.threadsPage.id_thread)
                                                                }} />
                                                        }
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="container-main__threads__thread__content">
                                            <div className="container-main__threads__thread__content__title">
                                                <div>
                                                    <p><Link to={{pathname: `/main/${t.id_main}`}}>{t.name} {t.threadsPage.name} - Posted by 
                                                    </Link>
                                                    {
                                                        !t.threadsPage.usersThread.deleted ? 
                                                        <Link to={{ pathname: `/user/${t.threadsPage.usersThread.id_user}` }}>
                                                            &nbsp;u/{t.threadsPage.usersThread.username}
                                                        </Link>
                                                        :
                                                        <span>&nbsp;{t.threadsPage.user_delete}</span>
                                                    } 
                                                    &nbsp;at {changeFormat(t.threadsPage.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="container-main__threads__thread__content__message">
                                                <Link to={{ pathname: `/main/thread/${t.threadsPage.id_thread}`, state: { 
                                                    dataThread: {
                                                        id_main: t.id_main,
                                                        name: t.name,
                                                        description: t.description,
                                                        subscribed_users: t.subscribed_users,
                                                        created_at: t.created_at,
                                                        users: t.threadsPage.usersThread
                                                    }
                                                }} } onClick={saveLocalStorage(t.name, t.description, t.subscribed_users, t.created_at, t.threadsPage.usersThread)}>
                                                    <h3>{t.threadsPage.thread_message}</h3>
                                                </Link>
                                            </div>
                                            <div className="container-main__threads__thread__content__options">
                                                <ul>
                                                    <li>Give Award</li>
                                                    <li>Share</li>
                                                    <li>Save</li>
                                                    <li>...</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>  
                    <div className="container-side">
                        <Community
                            value={reduceMain()}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export {Homepage as default}