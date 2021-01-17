import React, {useEffect, useContext, useState} from 'react';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {GET_SINGLE_MAIN, WAITING, SEND_REQUEST} from '../queries/profileQueries';
import {print} from 'graphql';
import ProfileThreads from './ProfileThreads';
import {formatUser} from '../handler';
import {HeaderContext} from '../context/HeaderContext';
import {ProfileContext} from '../context/ProfileContext';
import {MainContext} from'../context/MainContext';
import {FriendsContext} from '../context/FriendsContext';
import {NotificationContext} from '../context/NotificationContext';
import {TokensContext} from '../context/TokensContext';
import {ChatSystemContext} from '../context/ChatSystemContext';
import axios from 'axios';

const Profile = ({threads, otherUsers, userId}) => { 
    const [profile,] = useContext(ProfileContext);

    const {oc} = useContext(ChatSystemContext);

    const [openChat, dispatchOpenChat] = oc;

    const {p} = useContext(HeaderContext);

    const [, setPlace] = p;

    const [, dispatchNotification] = useContext(NotificationContext);

    const {a} = useContext(TokensContext);

    const [auth,] = a;

    const [friends,] = useContext(FriendsContext);

    const [currentDash, setCurrentDash] = useState('Overview');

    const [current, setCurrent] = useState('New');

    const [main, dispatchMain] = useContext(MainContext);

    const [request, setRequest] = useState(undefined);

    const history = useHistory();

    const params = useParams();

    const location = useLocation();

    const URL = process.env.REACT_APP_URL;

    useEffect(() => {
        if(threads.length > 0){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(GET_SINGLE_MAIN),
                    variables: {
                        id_main: threads[0].id_main
                    }
                },
                headers: {
                    'Content-Type' : 'application/json'
                },
                withCredentials: true
            })
            .then(res => {
                dispatchMain({
                    type: 'GET_MAIN',
                    data: res.data.data.getSingleMain
                })
                afterSubmit();
            })
            .catch(err => console.log(err))
        }
    }, [])

    useEffect(() => {
        setPlace(profile.username);
    }, [location.pathname])

    const compare = (a, b) => {
        if(current === 'New'){
            if (a.created_at < b.created_at){
                return 1;
            }
              if (a.created_at > b.created_at){
                return -1;
            } 
        }else if(current === 'Top'){
            if (a.upvote < b.upvote){
                return 1;
            }
              if (a.upvote > b.upvote){
                return -1;
            }
        }
        return 0;
    }

    const sortedThreads = threads.map(t => t).sort(compare);

    const sendRequest = () => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(SEND_REQUEST),
                variables: {
                    id_addressed: otherUsers.id_user
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            console.log(res)
            const { id_friendship, id_requested, id_addressed, status, id_specifier, specifiedtime, users } = res.data.data.sendFriendship;
            dispatchNotification({
                type: 'ADD_NOTIFICATION',
                id_friendship,
                id_requested,
                id_addressed,
                status,
                id_specifier,
                specifiedtime,
                id_user: users.id_user,
                username: users.username
            })
            afterSubmit();
        })
        .catch(err => console.log(err))
    }


    const afterSubmit = () => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(WAITING),
                variables: {
                    id_addressed: userId
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            setRequest(res.data.data.waiting);
        })
        .catch(err => console.log(err))
    }

    const checkFriends = () => {
        let isFriend;

        if(friends){
            isFriend = friends.filter(f => f.id_user === otherUsers.id_user);
        }else{
            isFriend = [];
        }

        return isFriend;
    }

    const canChat = () => {
        let bool;

        if(friends){
            bool = friends.map(f => f.id_user.includes(params.id));
            bool = bool.includes(true) ? false : true;
        }

        return bool;
    }

    const customChat = () => {
        dispatchOpenChat({
            type: 'GET_OPEN',
            data: !openChat
        })
    }

    return(
        <div className="container">
            <div className="container-profile">
                <div className="container-profile__dashboard">
                    <div className={currentDash === 'Overview' ? "container-profile__dashboard__filter" : "container-profile__dashboard__filter__two"}>
                        <ul className="container-profile__dashboard__filter__list">
                            <li className={currentDash === 'Overview' ? 'current' : ''} onClick={() => setCurrentDash('Overview')}>Overview</li>
                            <li className={currentDash === 'Posts' ? 'current' : ''} onClick={() => setCurrentDash('Posts')}>Posts</li>
                            <li className={currentDash === 'Comments' ? 'current' : ''} onClick={() => setCurrentDash('Comments')}>Comments</li>
                        </ul>
                    </div>
                </div>
                <div className={currentDash === 'Overview' ? "container-profile__user" : "container-profile__user__two"}>
                    <div className="container-profile__user__main">
                        <div className="container-profile__user__main__filter">
                            <ul className="container-profile__user__main__filter__list">
                                <li className={current === 'New' ? 'current-dash' : ''} onClick={() => setCurrent('New')}>New</li>
                                <li className={current === 'Top' ? 'current-dash' : ''} onClick={() => setCurrent('Top')}>Top</li>
                            </ul>
                        </div>
                        <div className="container-profile__user__thread">
                            {
                                sortedThreads.length > 0 ?
                                    sortedThreads.map(t => (
                                        <ProfileThreads 
                                            key={t.id_thread}
                                            value={t}
                                            id_user={profile.id_user === userId ? profile.id_user : otherUsers.id_user}
                                            username={profile.id_user === userId ? profile.username : otherUsers.username}
                                            currentDash={currentDash}
                                            main={main}
                                        />
                                    ))
                                :
                                <div className="container-profile__user__thread__noitems">
                                    <h3>No content here</h3>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="container-profile__user__side">
                        <div className="container-profile__user__side__card">
                            <div className="container-profile__user__side__card__image">
                                <div className="container-profile__user__side__card__image__sub">
                                    <div>

                                    </div>
                                </div>
                            </div>
                            <div className="container-profile__user__side__card__details">
                                <div className="container-profile__user__side__card__details__name">
                                    <b>{`u/${profile.id_user === userId ? profile.username : otherUsers.username}`}</b>
                                </div>
                                <div className="container-profile__user__side__card__details__first">
                                    <div>
                                        <p>Karma</p>
                                        <p>10,000</p>
                                    </div>
                                    <div>
                                        <p>Cake day</p>
                                        <p>{profile.id_user === userId ? formatUser(profile.created_at) : formatUser(otherUsers.created_at)}</p>
                                    </div>
                                </div>
                                {
                                    profile.id_user === userId ?
                                    <div className="container-profile__user__side__card__details__second__auth">
                                        <button onClick={() => history.push("/createPost")}>Create Thread</button>
                                    </div>
                                    :
                                    <div className="container-profile__user__side__card__details__second__noauth">
                                        {
                                            checkFriends().length > 0 ?
                                            <button>Friends</button>
                                            :
                                            !request ? 
                                            <button onClick={() => sendRequest()}>Request</button> 
                                            :
                                            <button>Waiting response</button>
                                        }
                                        <button onClick={() => customChat()} style={canChat() === true && !auth ? {opacity: "0.4", cursor: "not-allowed"} : {}} disabled={canChat()}>Chat..</button>
                                    </div>
                                }
                                <div className="container-profile__user__side__card__details__third">
                                    <h4>More options</h4>
                                </div>
                            </div>
                        </div>
                        {
                            profile.id_user === userId &&
                            <div className="container-profile__user__side__friends">
                                <h3>Friends {friends ? friends.length : 0}</h3>
                                {
                                    friends &&
                                    <ul className="container-profile__user__side__friends__list">
                                        {
                                            friends.map(f => (
                                                <li key={f.id_user}>{f.username}</li>
                                            ))
                                        }
                                    </ul>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export {Profile as default}