import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCommentAlt} from '@fortawesome/free-solid-svg-icons';
import {changeFormat} from '../handler';

const PostsThreads = ({main, value, username, currentDash, id_user}) => {

    const [open, setOpen] = useState(undefined);

    const m = value.posts && value.posts.map(p => p.id_user);

    return(
        <Fragment>
            {  
                value.id_user === id_user && currentDash === 'Posts' ?
                <Link className="container-profileThread__me" to={{ pathname: `/main/thread/${value.id_thread}`, state: {
                    dataThread: {
                        id_main: main.id_main,
                        name: main.name,
                        description: main.description,
                        created_at: main.created_at,
                        threads: value,
                        users: {
                            id_user,
                            username
                        }
                    }
                } }} style={currentDash === 'Posts' && {height: '6rem'}}>
                    <Fragment>
                        <div className="container-profileThread__me__votes">
                            <div>
                                
                            </div>
                        </div>
                        <div className="container-profileThread__me__all">
                            <div className="container-profileThreads__me__name">
                                <h4>{value.name}</h4>
                            </div>
                            <div className="container-profileThread__me__title">
                                <div>
                                    <h6>Main - Posted by u/{username} - {changeFormat(value.created_at)}</h6>
                                </div>
                            </div>      
                            <div className="container-profileThread__me__options">
                                <div className="container-profileThread__me__options__info">
                                    <ul>
                                        <li onClick={() => setOpen(!open)}>Open</li>
                                        {
                                            value.posts ?
                                            <li>Comments {value.posts.length}</li>
                                            :
                                            <li>Comments 0</li>
                                        }
                                        <li>Give Award</li>
                                        <li>Share</li>
                                        <li>Save</li>
                                    </ul>
                                </div>
                            </div>   
                            {
                                open ?
                                    <div className="container-profileThread__me__content__message">
                                        <p>{value.thread_message}</p>
                                    </div>
                                :
                                    ''
                            }
                        </div>   
                    </Fragment> 
                </Link>
                : 
                value.posts && m[0] === id_user && currentDash === 'Comments' ?
                <Link className="container-profileThread__other" to={{ pathname: `/main/thread/${value.id_thread}`, state: {
                    dataThread: {
                        id_main: main.id_main,
                        name: main.name,
                        description: main.description,
                        members: main.members,
                        threads: value,
                        created_at: main.created_at,
                        users: {
                            id_user,
                            username
                        }
                    } 
                } }}>
                    {
                        value.posts.map(p => (
                            <Fragment key={p.id_message}>
                                <div className="container-profileThread__other__posts">
                                    <div className="container-profileThread__other__title">
                                        <div>
                                            <FontAwesomeIcon icon={faCommentAlt} />
                                        </div>
                                        <div>
                                            <h6>{username} commented on {value.name} - Main - Posted by {'not yet'}</h6>
                                        </div>
                                    </div>  
                                    <div className="container-profileThread__other__content">
                                        <div className="container-profileThread__other__content__info"> 
                                            <p>{username} 0 points - {p ? changeFormat(p.created_at) : ''}</p>
                                        </div>
                                        <div className="container-profileThread__other__content__message">
                                            <p>{p ? p.message : ''}</p>
                                        </div>
                                        <div className="container-profileThread__other__options__info">
                                            <ul>
                                                {
                                                    value.posts ? <li>Comments {value.posts.length}</li> : ''
                                                }
                                                <li>Give Award</li>
                                                <li>Share</li>
                                                <li>Save</li>
                                                <li>...</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        ))
                    }
                </Link>
                :
                ''
            }
        </Fragment>   
    )
}

export {PostsThreads as default}