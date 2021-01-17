import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCommentAlt} from '@fortawesome/free-solid-svg-icons';
import {changeFormat} from '../handler';

const OverviewThread = ({value, id_user, username, updateThread, main}) => {
    const idUser = value.posts && value.posts.map(p => p.id_user);

    return(
        <Fragment>   
            {   
                value.id_user === id_user &&
                <div className="container-profileThread__me">
                    <div className="container-profileThread__me__votes">
                        <div>
                            
                        </div>
                    </div>
                    <div className="container-profileThread__me__all">
                        <div className="container-profileThread__me__title">
                            <div>
                                <h6>Main - Posted by u/{username} - {changeFormat(value.created_at)}</h6>
                            </div>
                            <div>
                                <button onClick={updateThread}>Update</button>
                            </div>
                        </div>      
                        <Link className="container-profileThread__me__content" to={{ pathname: `/main/thread/${value.id_thread}`, state: {
                            dataThread: {
                                id_main: main.id_main,
                                name: main.name,
                                description: main.description,
                                subscribed_users: main.subscribed_users,
                                created_at: main.created_at,
                                threads: value,
                                users: {
                                    id_user,
                                    username
                                }
                            }
                        }}}>
                            <div className="container-profileThread__me__content__message">
                                <h1>{value.name}</h1>
                                <p>{value.thread_message}</p>
                            </div>
                        </Link>
                        <div className="container-profileThread__me__options">
                            <div className="container-profileThread__me__options__info">
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
                </div>
                }
                {
                value.posts && idUser[0] === id_user &&
                <div className="container-profileThread__other">
                    {
                        value.posts.map(p => (
                            <Fragment key={p.id_message}>
                                <div className="container-profileThread__other__posts">
                                    <div className="container-profileThread__other__title">
                                        <div>
                                            <FontAwesomeIcon icon={faCommentAlt} />
                                        </div>
                                        <div>
                                            <h6>{username} commented on {value.name}</h6>
                                        </div>
                                    </div>  
                                    <div className="container-profileThread__other__content">
                                        <Link to={{ pathname: `/main/thread/${value.id_thread}`, state: {
                                                dataThread: {
                                                    id_main: main.id_main,
                                                    name: main.name,
                                                    description: main.description,
                                                    threads: value,
                                                    created_at: main.created_at,
                                                    users: {
                                                        id_user,
                                                        username
                                                    }
                                                } 
                                            } }}>
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
                                        </Link>
                                    </div>
                                </div>
                            </Fragment>
                        ))
                    }
                </div>
                }
        </Fragment>
    )
}

export {OverviewThread as default}