import React, {useContext, useEffect, useState, Fragment} from 'react';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import {changeFormat} from '../handler';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp, faArrowDown, faLink} from '@fortawesome/free-solid-svg-icons';
import {ThreadVoteContext} from '../context/ThreadVoteContext';
import {HeaderContext} from '../context/HeaderContext';
import {ProfileContext} from '../context/ProfileContext';
import {TokensContext} from '../context/TokensContext';
import {MainContext} from '../context/MainContext';
import {ThreadContext} from '../context/ThreadContext';
import {formatUser} from '../handler';
import Join from '../handlerComponents/Join';
import {GET_MAIN} from '../queries/mainQueries';
import Vote from '../handlerComponents/Vote';
import {print} from 'graphql';
import axios from 'axios';

const MainPage = () => {
    const [loading, setLoading] = useState(true);

    const [profile,] = useContext(ProfileContext);

    const [currentFilter, setCurrentFilter] = useState('New');

    const [main, dispatchMain] = useContext(MainContext);

    const [threads, dispatchThreads] = useContext(ThreadContext);

    const {a} = useContext(TokensContext);
    
    const [auth,] = a;

    const {p} = useContext(HeaderContext);

    const [place, setPlace] = p;

    const {v, c, b} = useContext(ThreadVoteContext);

    const [votes,] = v;

    const [call, setCall] = c;

    const [buttonLoading, setButtonLoading] = b;

    const [updateJoin, setUpdateJoin] = useState(undefined);

    const URL = process.env.REACT_APP_URL;

    const location = useLocation();

    const history = useHistory();

    const { id } = useParams();

     useEffect(() => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(GET_MAIN),
                variables: {
                    id_main: id
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(res => {
            console.log(res);
            dispatchMain({
                type: 'GET_MAIN',
                data: res.data.data.getSingleMain
            })
            dispatchThreads({
                type: 'GET_THREADS',
                data: res.data.data.getSingleMain.threadsMain
            })
            setLoading(false);
        })
        .catch(err => console.log(err))
    }, [auth, location.pathname])

    useEffect(() => {
        setPlace(main.name);
    }, [location.pathname, loading])

    const joinMain = async () => {
        const res = await Join.handlesJoin(id);

        dispatchMain({
            type: 'ADD_MAIN',
            id_main: res.data.data.joinMain.id_main,
            users: res.data.data.joinMain.subscribed_users
        })

        setUpdateJoin(!updateJoin);
    }

    const removeMain = async () => {
        const res = await Join.handlesNotJoin(id);

        dispatchMain({
            type: 'REMOVE_MAIN',
            id_main: res.data.data.removeMain.id_main,
            users: res.data.data.removeMain.subscribed_users
        })

        setUpdateJoin(!updateJoin);
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

    const compare = (a, b) => {
        if(currentFilter === 'New'){
            if (a.created_at < b.created_at){
                return 1;
            }
              if (a.created_at > b.created_at){
                return -1;
            } 
        }else if(currentFilter === 'Top'){
            if (a.upvote < b.upvote){
                return 1;
            }
              if (a.upvote > b.upvote){
                return -1;
            }
        }
        return 0;
    }

    if(loading){
        return(
            <div className="loading">
                <span className="loading-spinners"></span>
            </div>
        )
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

    sortedThreads.map(s => console.log(s.postsThread));

    return(
        <div className="container-section">
            <div className="container-section__background">

            </div>
            <div className="container-section__info">
                <div className="container-section__info__content">
                    <div className="container-section__info__content__title">
                        <div>
                            <div>
                                <span></span>
                            </div>
                            <div>
                                <h1>{main.name}</h1>
                                <h3>r/{main.name}</h3>
                            </div>
                        </div>
                    </div>
                    {
                        auth &&
                        <div className="container-section__info__content__join">
                            {
                                main.subscribed_users && main.subscribed_users.includes(profile.id_user) ?
                                <button onClick={() => removeMain()}>JOINED</button>
                                :
                                <button onClick={() => joinMain()}>JOIN</button>
                            }   
                        </div>
                    }
                </div>
            </div>
            <div className="container-section__content">
                <div className="container-section__content_resize">
                    <div className="container-section__content__main">
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
                                                pathname: `/createPost`
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
                        <div className="container-section__content__main__filter">
                            <ul className="container-section__content__main__filter__list">
                                <li className={currentFilter === 'New' ? 'current' : ''} onClick={() => setCurrentFilter('New')}>New</li>
                                <li className={currentFilter === 'Top' ? 'current' : ''} onClick={() => setCurrentFilter('Top')}>Top</li>
                            </ul>
                            <p>...</p>
                        </div>
                        <div className="container-section__content__main__list">
                        {
                            sortedThreads.map(s => (
                            <Fragment key={s.id_thread}>
                                <div className="container-section__content__main__list__item">
                                    <div className="container-section__content__main__list__item__votes">
                                        <ul className="container-section__content__main__list__item__votes__list">
                                            <li>
                                                {
                                                    votes && votes.some(v => v.status_vote === 'upvote' && v.id_thread === s.id_thread) ?
                                                    <FontAwesomeIcon icon={faArrowUp} style={{color: 'blue'}} onClick={() => {
                                                        !buttonLoading && restoreVote(s.id_thread, 'neutral')
                                                    }} />
                                                    :
                                                    votes && votes.some(v => (v.status_vote === 'downvote' || v.status_vote === 'neutral') && v.created === 'true' && v.id_thread === s.id_thread) ?
                                                        <FontAwesomeIcon icon={faArrowUp} style={{color: 'red'}} onClick={() => {
                                                            !buttonLoading && updateVote(s.id_thread, 'upvote')
                                                        }} />
                                                            :
                                                        <FontAwesomeIcon icon={faArrowUp} onClick={() => {
                                                            !buttonLoading && addVote(s.id_thread)
                                                        }} />
                                                }
                                            </li>
                                            <li>
                                                {s.upvote + s.downvote}
                                            </li>
                                            <li>
                                                {
                                                    votes && votes.some(v => v.status_vote === 'downvote' && v.id_thread === s.id_thread) ?
                                                    <FontAwesomeIcon icon={faArrowDown} style={{color: 'blue'}} onClick={() => {
                                                        !buttonLoading && restoreVote(s.id_thread, 'neutral')
                                                    }} />
                                                    :
                                                    votes && votes.some(v => (v.status_vote === 'upvote' || v.status_vote === 'neutral') && v.created === 'true' && v.id_thread === s.id_thread) ?
                                                        <FontAwesomeIcon icon={faArrowDown} style={{color: 'red'}} onClick={() => {
                                                            !buttonLoading && updateVote(s.id_thread, 'downvote')
                                                        }} />
                                                            :
                                                        <FontAwesomeIcon icon={faArrowDown} onClick={() => {
                                                            !buttonLoading && removeVote(s.id_thread)
                                                        }} />
                                                }
                                            </li>
                                        </ul>
                                    </div>  
                                    <div className="container-section__content__main__list__item__all">
                                        <div className="container-section__content__main__list__item__title">
                                            <p>Posted by u/{s.users.username} at {changeFormat(s.created_at)}</p>
                                        </div>
                                        <div className="container-section__content__main__list__item__message">
                                            <Link to={{ pathname: `/main/thread/${s.id_thread}`, state: {
                                                dataThread: {
                                                    id_main: main.id_main,
                                                    name: main.name,
                                                    description: main.description,
                                                    subscribed_users: main.subscribed_users,
                                                    created_at: main.created_at,
                                                    users: s.users
                                                }
                                            }
                                            }} onClick={saveLocalStorage(main.name, main.description, main.subscribed_users, main.created_at, s.users)}>
                                                <h4>{s.name}</h4>
                                            </Link>
                                            <p>{s.thread_message}</p>
                                        </div>
                                        <div className="container-section__content__main__list__item__options">
                                            <span>Comments {s.postsThread[0].id_message === null ? 0 : s.postsThread.length}</span>
                                        </div>
                                    </div>
                                </div>  
                            </Fragment>
                            ))
                        }
                        </div>
                    </div>
                    <div className="container-section__content__side">
                        <div className="container-section__content__side__about">
                            <div className="container-section__content__side__about__com">
                                <h4>About Community</h4>
                            </div>
                            <div className="container-section__content__side__about__info">
                                <div>
                                    <p>{main.description}</p>
                                </div>
                                <div>
                                    <p>{main.subscribed_users ? main.subscribed_users.length : 0} members</p>
                                    <p>Created at<br /> {formatUser(main.created_at)}</p>
                                </div>
                            </div>
                            <div className="container-section__content__side__about__birth">
                                {
                                    auth &&
                                    <button onClick={() => {
                                        history.push({
                                            pathname: '/createPost'
                                        })
                                    }}>Create post</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {MainPage as default}