import React, {useContext, Fragment, useState} from 'react';
import {ProfileContext} from '../context/ProfileContext';
import {changeFormat} from '../handler';

const Posts = ({ value, main, update, auth, deleteP }) => {
    const [profile,] = useContext(ProfileContext);

    const [openUpdate, setOpenUpdate] = useState(undefined);

    const [text, setText] = useState('');

    return(
        <div className="container-thread__sub__main__response__container">
            <div className="container-thread__sub__main__response">
                <div className="container-thread__sub__main__response__votes">
                    
                </div>
                <div className="container-thread__sub__main__response__infos">
                    <div className="container-thread__sub__main__response__username">
                        <div>
                            {
                                value.user.deleted ?
                                <p>r/{main} - wrote by deleted - {changeFormat(value.created_at)}</p>
                                :
                                <p>r/{main} - wrote by u/{value.user.username} - {changeFormat(value.created_at)}</p>
                            }
                        </div>
                    </div>
                    <div className="container-thread__sub__main__response__message" style={!auth ? {borderBottomRightRadius: '5px'} : {}}>
                        <p>{value.message}</p>
                    </div>
                    <div className="container-thread__sub__main__response__options" style={auth ? {borderBottomRightRadius: '5px'} : {}}>
                        <div>
                            <ul>
                                {auth && profile.id_user === value.user.id_user ?
                                    <Fragment>
                                        <li onClick={() => {
                                            setOpenUpdate(!openUpdate);
                                        } }>Update</li>
                                        <li onClick={() => {
                                            deleteP(value.id_message);
                                        } }>Delete</li>
                                    </Fragment>
                                    :
                                    ''
                                }
                            </ul>
                        </div>
                        {
                            openUpdate &&
                            <div>
                                <textarea type="text" value={text || ''} onChange={(e) => setText(e.target.value)} placeholder="message"/><br />
                                <button onClick={() => {
                                    update(text, value.id_message)
                                    setText('')
                                }}>Continue</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export {Posts as default}