import React, {useState, useContext, useEffect} from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { ThreadContext } from '../context/ThreadContext';
import { useHistory } from 'react-router-dom';
import { TextField, Button, TextareaAutosize } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faTimes, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { Formik, Field, Form } from 'formik';
import { GET_MAIN, CREATE_THREAD } from '../queries/threadQueries';
import { print } from 'graphql';
import * as yup from 'yup';
import axios from 'axios';

const CreatePost = () => {
    const [filters, setFilters] = useState(undefined);

    const [main, setMain] = useState([]);

    const [id_main, setId_main] = useState('');

    const [mainName, setMainName] = useState('');

    const [searchValue, setSearchValue] = useState('');

    const [profile,] = useContext(ProfileContext);

    const [, dispatchThreads] = useContext(ThreadContext);

    const URL = process.env.REACT_APP_URL;

    const history = useHistory();

    useEffect(() => {
        axios(URL,{
            method: 'POST',
            data: {
                query: print(GET_MAIN)
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(res => {
            setMain(res.data.data.readMain)
        })
        .catch(err => console.log(err))
    }, [])

    const search = () => {
        if(searchValue.length > 0){
            return main.filter(m => {
                return (m.name.toLowerCase()).includes(searchValue.toLowerCase())
            })
        }else{
            return main
        }
    }

    const createThread = (data) => {
        if(mainName){
            axios(URL, {
                method: 'POST',
                data: {
                    query: print(CREATE_THREAD),
                    variables: {
                        name: data.title,
                        subject: data.title,
                        thread_message: data.message,
                        id_main
                    }
                },
                headers: {
                    'Content-Type' : 'application/json'
                },
                withCredentials: true
            })
            .then(res => {
                dispatchThreads({
                    type: 'CREATE_THREADS',
                    id_main: id_main,
                    name: mainName,
                    description: 'ueee',
                    members: 0,
                    id_thread: res.data.data.createThread.id_thread,
                    title: res.data.data.createThread.name,
                    message: res.data.data.createThread.thread_message,
                    id_user: profile.id_user,
                    username: profile.username
                })
            })
            .then(() => setTimeout(() => {
                history.push('/');
            }, 1000))
            .catch(err => console.log(err))
        }else{
            alert('Information missing, please choose the main by clicking the arrow')
        }
    }

    const validationSchema = yup.object({
        title: yup.string().required().max(30),
        message: yup.string().required(),
        type: yup.string().notRequired()
    })

    return(
        <div className="container-create">
            <div className="container-create__center">
                <div className="container-create__center__main">
                    <div className="container-create__center__main__title">
                        <h3>Create a post</h3>
                        <h3>Draft</h3>
                    </div>
                    <div className="container-create__center__main__community">
                        <div className="container-create__center__main__community__search">
                            <div className="container-create__center__main__community__search__title">
                                {filters ? <input type="text" value={searchValue || ''} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search communities"/> : !mainName ? 'Choose a community' : mainName}
                            </div>
                            <div className="container-create__center__main__community__search__button">
                                <button onClick={() => {
                                    setMainName('');
                                    setFilters(!filters)
                                }}>{filters ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faCaretDown} />}</button>
                            </div>
                        </div>
                        {   
                            filters ? 
                            <div className={filters ? 'container-create__center__main__community__search__list' : ''}>
                                <div className="container-create__center__main__community__search__list__user">
                                    <div>
                                        <p>Your profile</p>
                                    </div>
                                    <div>
                                        User
                                    </div>
                                </div>
                                <div className="container-create__center__main__community__search__list__threads">
                                    <div>
                                        <p>My communities</p>
                                    </div>
                                    <ul className="container-create__center__main__community__search__list__threads__items">
                                        {
                                            search().map(m => (
                                                <li key={m.id_main} onClick={() => {
                                                    setId_main(m.id_main)
                                                    setMainName(m.name)
                                                    setFilters(!filters)
                                                }}>{m.name}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                            :
                            ''
                        }
                    </div>
                    <div className="container-create__center__main__form">
                        <div className="container-create__center__main__form__option">
                            <div>
                                <span>
                                    <FontAwesomeIcon icon={faCommentAlt} style={{color: '#0079d3'}} />
                                </span>
                                <h3>Post</h3>
                            </div>
                        </div>
                        <div>
                            <Formik 
                                initialValues={{title: '', message: ''}}
                                validationSchema={validationSchema}
                                onSubmit={(data, {setSubmitting}) => {
                                    setSubmitting(true);
                                    createThread(data)
                                    setSubmitting(false);
                                }}
                            >
                                {   
                                    ({values, errors, isSubmitting}) => (
                                      <Form className="container-create__center__main__form__write">
                                            <div className="container-create__center__main__form__write__title">
                                                <Field 
                                                    style={{border: 'none'}}
                                                    className="title"
                                                    placeholder="title"
                                                    name="title"
                                                    type="input"
                                                    as={TextField}
                                                />
                                            </div>
                                            <div className="container-create__center__main__form__write__message">
                                                <Field 
                                                    style={{height: '100%', border: 'none'}}
                                                    className="textarea"
                                                    placeholder="message"
                                                    name="message"
                                                    type="textarea"
                                                    as={TextareaAutosize}
                                                />
                                            </div>
                                            <div className="container-create__center__main__form__write__post">
                                                <div>
                                                    <Field name="type" type="button" value={'OC'} as={Button}>+ OC</Field>
                                                    <Field name="type" type="input" value={'Spoiler'} as={Button}>+ Spoiler</Field>
                                                    <Field name="type" type="input" value={'NSFW'} as={Button}>+ NSFW</Field>
                                                    <Field name="type" type="input" value={'Flair'} as={Button}>+ Flair</Field>
                                                </div>
                                                <div className="container-create__center__main__form__write__post__buttons">
                                                    <Button onClick={() => history.push('/')}>Cancel</Button>
                                                    <Button disabled={isSubmitting} type="submit">Post</Button>
                                                </div>
                                            </div>
                                      </Form>
                                    )
                                }
                            </Formik>
                        </div>
                        <div className="container-create__center__main__form__notification">
                            <div className="container-create__center__main__form__notification__active">
                                <input type="radio" name="check"/>
                                <label>Send me post reply notification</label>
                            </div>
                            <div className="container-create__center__main__form__notification__shared">
                                <h4>Connect accounts to share your post</h4>
                                <span>i</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-create__center__sub">
                    <div className="container-create__center__sub__main">
                        <div className="container-create__center__sub__main__title">
                            <h4>Posting to reddit</h4>
                        </div>
                        <div className="container-create__center__sub__main__list">
                            <div>
                                <p>1. Remember the human</p>
                            </div>
                            <div>
                                <p>2. Behave like you would in real life</p>
                            </div>
                            <div>
                                <p>3. Look for the original source of content</p>
                            </div>
                            <div>
                                <p>4. Search for duplicates before posting</p>
                            </div>
                            <div>
                                <p>5. Read the community’s rules</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {CreatePost as default}