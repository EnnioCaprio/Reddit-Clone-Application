import React, {Fragment, useContext, useState} from 'react';
import { faHome, faComment, faMarker, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useHistory } from 'react-router-dom';
import { TokensContext } from '../context/TokensContext';
import { HeaderContext } from '../context/HeaderContext';
import { ProfileContext } from '../context/ProfileContext';
import { NightModeContext } from '../context/NightModeContext';
import { NotificationContext } from '../context/NotificationContext';
import { ChatSystemContext } from '../context/ChatSystemContext';
import { LOGOUT, UPDATE_NOTIFICATION } from '../queries/headerQueries';
import { print } from 'graphql';
import gql from 'graphql-tag';
import axios from 'axios';

const MainHeader = () => {
    const {oc} = useContext(ChatSystemContext);

    const [openChat, dispatchOpenChat] = oc;

    const {o} = useContext(TokensContext);

    const [, setOk] = o;

    const {p} = useContext(HeaderContext);

    const [place,] = p;

    const [profile, dispatchProfile] = useContext(ProfileContext);

    const [notification, dispatchNotification] = useContext(NotificationContext);

    const [open, setOpen] = useState(undefined);

    const [openNotification, setOpenNotification] = useState(undefined);

    const [aSearch, setASearch] = useState(undefined);

    const [night, setNight] = useContext(NightModeContext);

    const [mainResult, setMainResult] = useState(undefined);

    const history = useHistory();

    const URL = process.env.REACT_APP_URL;

    const search = (e) => {
        if(e.key === 'Enter'){
            const SEARCH_MAIN = gql`
            query readMainName($name: String!){
                readMainName(name: $name){
                    id_main,
                    name
                }
            }
        `;

        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(SEARCH_MAIN),
                variables: {
                    name: e.target.value
                } 
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            setMainResult(res.data.data.readMainName);
        })
        .catch(err => console.log(err))
        }
    }

    const redirectMain = (id_main) => {
        history.push({
            pathname: `/main/${id_main}`,
            state: {
                id: id_main
            }
        })
    }

    const logout = () => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(LOGOUT)
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            if(res.data.data.logout === true){
                setOk(false)
            }
            dispatchProfile({
                type: 'REFRESH_INFO',
                data: []
            })
            dispatchNotification({
                type: 'GET_NOTIFICATION',
                data: []
            })
        })
        .catch(err => console.log(err))
    }

    const updateStatus = (id_friendship, status, id_specifier) => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(UPDATE_NOTIFICATION),
                variables: {
                    id_friendship,
                    status,
                    id_specifier
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            dispatchNotification({
                type: 'REMOVE_NOTIFICATION',
                id_friendship: res.data.data.updateFriendshipStatus.id_friendship
            })
        })
        .catch(err => {
            throw err
        })
    }

    return(
        <Fragment>
            <div className="header clearfix">
                <div className="header-left">
                    <div className="header-logo">
                        <NavLink to="/">
                            <span>
                                <h5>Reddit</h5>
                                <FontAwesomeIcon icon={faHome} />
                            </span>
                        </NavLink>
                    </div> 
                    <div className="header-place">
                        <span>{place}</span>
                    </div>
                    <div className="header-center" onClick={() => setASearch(!aSearch)}>
                        <input type="text" onKeyPress={(e) => search(e)} placeholder="search"/>
                        <div className={aSearch ? "header-center__result" : ""}>
                            {
                                    aSearch && mainResult ? 
                                    <ul className="header-center__core__result__users">
                                        {
                                            mainResult.map(m => (
                                                <li key={m.id_main} onClick={() => {
                                                    redirectMain(m.id_main)
                                                }}>{m.name}</li>
                                            ))
                                        }
                                    </ul>
                                    :
                                    ''
                                }
                            <ul className="header-center__result__sub">
                                
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="header-right">
                    <ul className="header-links__first">
                        <li onClick={() => dispatchOpenChat({
                            type: 'GET_OPEN',
                            data: !openChat
                        })}>
                            <FontAwesomeIcon icon={faComment} />
                        </li>
                        <NavLink to="/createPost">
                            <li>
                                <FontAwesomeIcon icon={faMarker} />
                            </li>
                        </NavLink>
                    </ul>
                    <div className="header-links__second">
                        <ul>
                            <li onClick={() => {
                                setOpenNotification(!openNotification)
                                setOpen(false);
                            }}>
                                <FontAwesomeIcon icon={faBell} style={notification.length > 0 ? {color: "#e3d622"} : {}} />
                            </li>
                        </ul>
                        {
                            openNotification &&
                            <div className="header-user__notification">
                                {
                                    notification.length > 0 && notification.map(u => u.id_addressed).includes(profile.id_user) ?
                                        <ul>
                                            {
                                                notification.map(n => (
                                                    <Fragment key={n.users.id_user}>
                                                        <li>
                                                            <div>
                                                                <p>{n.users.username} sent you friend request</p>
                                                            </div>
                                                            <div>
                                                                {n.status === 'R' && 
                                                                    <button onClick={() => {
                                                                        updateStatus(n.id_friendship, 'A', n.id_specifier)
                                                                    }}>Accept</button>
                                                                }
                                                                {n.status === 'R' &&
                                                                    <button onClick={() => {
                                                                        updateStatus(n.id_friendship, 'D', n.id_specifier)
                                                                    }}>Decline</button>
                                                                }
                                                            </div>
                                                        </li>
                                                    </Fragment>
                                                ))
                                            }
                                        </ul>
                                    :
                                        <h6>No notifications here</h6>
                                    }
                            </div>    
                        }
                    </div>
                    <div className="header-user">
                        <span onClick={() => {
                            setOpen(!open)
                            setOpenNotification(false)
                        }}>u/{profile.username && profile.username.length > 6 ? profile.username.substring(0, 5) : profile.username}</span>
                        {
                            open &&
                            <div className="header-user__list">
                                <div className="header-user__list__night">
                                    <p>View option</p>
                                    <ul>
                                        <li>
                                            <p>Night Mode</p>
                                            <i className="header-main__night" onClick={() => setNight(!night)} style={night ? {justifyContent: 'flex-end', background: '#0079d3'} : {}}>
                                                <i></i>
                                            </i>
                                        </li>
                                    </ul>
                                </div>
                                <ul className="header-user__list__items">
                                    <li>More stuff</li>
                                    <NavLink to={{ pathname: `/profile/${profile.id_user}`}} style={{textDecoration: 'none', textAlign: 'left'}}>
                                        <li>Profile</li>
                                    </NavLink>
                                    <NavLink to={{ pathname: `/setting/${profile.id_user}`}} style={{textDecoration: 'none', textAlign: 'left'}}>
                                        <li>User setting</li>
                                    </NavLink>
                                </ul>
                                <ul className="header-user__list__items">
                                    <li onClick={logout}>LOG OUT</li>
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export { MainHeader as default }