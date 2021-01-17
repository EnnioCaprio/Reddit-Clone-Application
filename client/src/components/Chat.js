import React, {useContext, useState, useReducer, Fragment, useEffect, useRef} from 'react';
import { ChatSystemContext } from '../context/ChatSystemContext';
import { FriendsContext } from '../context/FriendsContext';
import { ProfileContext } from '../context/ProfileContext';
import { NightModeContext } from '../context/NightModeContext';
import listUsersReducer from '../reducers/listUsersReducer';
import messageReducer from '../reducers/messageReducer';
import { sendMessage } from '../subscriptions/MessageSubscriptions';
import { useSubscription } from '@apollo/react-hooks';
import { changeFormatMessage } from '../handler';
import { CREATE_CHAT, GET_MESSAGES, SEND_MESSAGE, SINGLE_CHAT } from '../queries/chatQueries';
import { print } from 'graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMinimize, faComments, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Chat = () => {
    const [friends] = useContext(FriendsContext);

    const [profile] = useContext(ProfileContext);

    const [night, setNight] = useContext(NightModeContext);

    const {oc, c} = useContext(ChatSystemContext);

    const [openChat, dispatchOpenChat] = oc;

    const [chats, dispatchChats] = c;

    const [minChat, setMinChat] = useState(undefined);

    const [messages, dispatchMessages] = useReducer(messageReducer, []);

    const [message, setMessage] = useState('');

    const [changeChat, setChangeChat] = useState('directs');

    const [searchValue, setSearchValue] = useState('');

    const [addChat, setAddChat] = useState(undefined);

    const [listUser, dispatchListUser] = useReducer(listUsersReducer, []);

    const [group, setGroup] = useState('');

    const messagesEndRef = useRef(null)

    const [room, setRoom] = useState(undefined);

    const URL = process.env.REACT_APP_URL;

    const scrollToBottom = () => {
        if (messagesEndRef && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    const {data, loading, error} = useSubscription(sendMessage, {
        variables: {
            id_chat: room ? room[0].id_chat : undefined
        }
    });


    useEffect(() => {
        if(!loading && data){
            dispatchMessages({
                type: 'SEND_MESSAGE',
                username: data.newMessage.username,
                id_message: data.newMessage.id_message,
                message: data.newMessage.message,
                created_at: data.newMessage.created_at
            })
        }
    }, [loading, data])

    useEffect(() => scrollToBottom, [chats, messages])

    const readSingleChat = (id_chat) => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(SINGLE_CHAT),
                variables: {
                    id_chat
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            setRoom(res.data.data.readSingleChat);
        })
        .catch(err => console.log(err))

        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(GET_MESSAGES),
                variables: {
                    id_chat
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            dispatchMessages({
                type: 'GET_MESSAGES',
                data: res.data.data.readMessages
            })
        })
        .catch(err => console.log(err))
    }

    const search = () => {
        if(searchValue.length > 0){
            return friends.filter(f => {
                return (f.username.toLowerCase()).includes(searchValue.toLowerCase())
            })
        }else{
            return friends
        }
    }

    if(!openChat){
        return(
            <Fragment>

            </Fragment>
        )
    }

    const createTheRoom = (group) => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(CREATE_CHAT),
                variables: {
                    name: group,
                    list: listUser.map(l => l.id_user)
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            dispatchChats({
                type: 'ADD_CHAT',
                data: res.data.data.createChat[0]
            })
        })
        .catch(err => console.log(err))

        setAddChat(!addChat);
        setGroup('');
        dispatchListUser({
            type: 'RESTART_LIST',
            data: []
        })
    }

    const createMessage = () => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(SEND_MESSAGE),
                variables: {
                    message,
                    id_chat: room[0].id_chat
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        setMessage('');
    }

    return(
        <Fragment>
            {
                !minChat ?
            <div className="container-chatService">
                {
                    !addChat ?
                    <div className="container-chatService__sub">
                    <div className="container-chatService__sub__first">
                        <div className="container-chatService__sub__first__group">
                            <div className={changeChat === 'rooms' ? 'active_group' : ''}>
                                <button onClick={() => setChangeChat('rooms')}>Rooms</button>
                            </div>
                            <div className={changeChat === 'directs' ? 'active_group' : ''}>
                                <button onClick={() => setChangeChat('directs')}>Directs</button>
                            </div>
                        </div>
                        {
                            changeChat === 'directs' ?
                            <Fragment>
                                <div className="container-chatService__sub__first__chat">
                                    {
                                        chats.length === 0 ?
                                        <Fragment>
                                            <p>Chat</p>
                                            <p>All the direct chats here .</p>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <ul>
                                                {
                                                    chats.map(c => (
                                                        <li key={c.id_chat} onClick={() => readSingleChat(c.id_chat)}
                                                            style={room && room[0].id_chat === c.id_chat ? {background: 'rgba(0,0,0,0.4)'} : {}}
                                                        >
                                                            <b>{c.name}</b>
                                                            <p>Last message</p>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </Fragment>
                                    }
                                </div>
                                <div className="container-chatService__sub__first__start">
                                    <div>
                                        <button onClick={() => {
                                            setAddChat(!addChat);
                                            dispatchListUser({
                                                type: 'ADD_USER',
                                                id_user: profile.id_user,
                                                username: profile.username
                                            })
                                        }}>
                                            <FontAwesomeIcon icon={faComments} style={{color: '#0079d3'}} />
                                            <p>Start a chat</p>
                                        </button>
                                    </div>
                                </div>
                            </Fragment> 
                            :
                            <Fragment>
                                <div className="container-chatService__sub__first__chat">
                                    <p>Joined rooms</p>
                                    <p>All the rooms here .</p>
                                </div>
                            </Fragment>
                        }
                    </div>
                    <div className="container-chatService__sub__second">
                        <div className="container-chatService__sub__second__detail">
                            <div>
                                {
                                    !room ? 
                                    <h4>Start chatting</h4>
                                    : 
                                    <h4>{room[0].name.substring(0, 12)} - {room[0].users.length} members</h4>
                                }
                            </div>
                            <div>
                                <ul>
                                    <li onClick={() => setMinChat(!minChat)}>
                                        <FontAwesomeIcon icon={faWindowMinimize} style={{cursor: 'pointer'}}/>
                                    </li>
                                    <li onClick={() => dispatchOpenChat({
                                        type: 'CLOSE_CHAT',
                                        data: !openChat
                                    })}>
                                        <FontAwesomeIcon icon={faTimes} style={{cursor: 'pointer'}}/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="container-chatService__sub__second__room">
                            {
                                !room ?
                                <div className="container-chatService__sub__second__room__center">
                                    <div className={!night ? "container-chatService__sub__second__room__center__img" : "container-chatService__sub__second__room__center__img-night"}>

                                    </div>
                                    <h3>Start a new chat</h3>
                                    <p>You can start a chat with the button below, create your room</p>
                                </div>
                                :
                                <div className="container-chatService__sub__second__room__messages">
                                    <ul>
                                        {
                                            messages.map(m => (
                                                <li key={m.id_message}>
                                                    <div className="container-chatService__sub__second__room__messages__icon">
                                                        <p></p> 
                                                    </div>
                                                    <div className="container-chatService__sub__second__room__messages__message">
                                                        <span><b>{m.username}</b> <p>{changeFormatMessage(m.created_at)}</p></span>
                                                        <span><p>{m.message}</p></span>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <div ref={messagesEndRef} />
                                </div>
                            }
                        </div>
                        {
                            !room ?
                            <div className="container-chatService__sub__second__join">
                                <div>
                                    <button onClick={() => {
                                        setAddChat(!addChat);
                                        dispatchListUser({
                                            type: 'ADD_USER',
                                            id_user: profile.id_user,
                                            username: profile.username
                                        })
                                    }}>New chat</button>
                                </div>
                            </div>
                            :
                            <div className="container-chatService__sub__second__message">
                                <div>
                                    <input type="text" value={message || ''} onChange={(e) => setMessage(e.target.value)} placeholder="Enter a message"/>
                                    <span onClick={() => createMessage()}>
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </span>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                :
                <div className={listUser.length === 0 ? "container-chatService__add" : "container-chatService__addelse"}>
                    <div className="container-chatService__add__title">
                        <h4>Create Group</h4>
                    </div>
                    {
                        listUser.length > 0 &&
                        <div className="container-chatService__add__name">
                            <input type="text" value={group || ''} onChange={(e) => setGroup(e.target.value)} placeholder="Group name required" maxLength="30"/>
                            <span>{30 - group.length}</span>
                        </div>
                    }
                    <div className="container-chatService__add__find">
                        <div className="container-chatService__add__find__search" style={listUser.length > 0 ? {display: 'grid', gridTemplateRows: '50% 50%'} : {}}>
                            <div>
                                <label>To:</label>
                                <input type="text" value={searchValue || ''} onChange={(e) => setSearchValue(e.target.value)} placeholder="search"/>
                            </div>
                            <div>
                                {
                                    listUser.length > 0 &&
                                    <ul>
                                    {
                                        listUser.map(l => (
                                            <li key={l.id_user}>{l.username}</li>        
                                        ))
                                    }
                                    </ul>
                                }
                            </div>
                        </div>
                        <div className="container-chatService__add__find__friends">
                            {
                                search().length > 0 ?
                                <ul className="container-chatService__add__find__friends__list">
                                    {
                                    search().map(f => (
                                        <li key={f.id_user}>
                                            <div>
                                                <i></i>
                                                <p>{f.username}</p>
                                            </div>
                                            {
                                                listUser.map(l => l.username).includes(f.username) ?
                                                <span onClick={() => dispatchListUser({
                                                    type: 'REMOVE_USER',
                                                    id_user: f.id_user
                                                })} className="users_removed"></span>
                                                :
                                                <span onClick={() => dispatchListUser({
                                                    type: 'ADD_USER',
                                                    id_user: f.id_user,
                                                    username: f.username
                                                })} className="users_added"></span>
                                            }
                                        </li>
                                    ))
                                    }
                                </ul>
                                :
                                <div className="container-chatService__add__find__friends__none">
                                    <h3>No friends yet</h3>
                                </div>
                            }               
                        </div>
                    </div>
                    <div className="container-chatService__add__options">
                        <div>
                            <button onClick={() => {
                                setAddChat(!addChat);
                                setGroup('');
                                dispatchListUser({
                                    type: 'RESTART_LIST',
                                    data: []
                                })
                            }}>Cancel</button>
                            {
                                group.length > 0 && listUser.length > 1 &&
                                <button onClick={() => createTheRoom(group)}>Start a chat</button>
                            }
                        </div>
                    </div>
                </div>
                }
            </div>
            :
            <div className="container-chatService__min" onClick={() => setMinChat(!minChat)}>
                <h4>Chat</h4>
            </div>
            }
        </Fragment>
    )
}

export {Chat as default}