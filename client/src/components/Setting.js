import React, {useContext, useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCog, faTrash} from '@fortawesome/free-solid-svg-icons';
import {DELETE_PROFILE, UPDATE_USERNAME, UPDATE_EMAIL, UPDATE_PASSWORD} from '../queries/profileQueries';
import {LOGOUT} from '../queries/headerQueries';
import {print} from 'graphql';
import {ProfileContext} from '../context/ProfileContext';
import {TokensContext} from '../context/TokensContext';
import {HeaderContext} from '../context/HeaderContext';
import axios from 'axios';

const Setting = () => {
    const history = useHistory();

    const {o} = useContext(TokensContext);

    const [, setOk] = o;

    const {p} = useContext(HeaderContext);

    const [place, setPlace] = p;

    const [profile, dispatchProfile] = useContext(ProfileContext);

    const [username, setUsername] = useState('');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState({ password: '', checkPassword: '', equals: undefined});

    const location = useLocation();

    const URL = process.env.REACT_APP_URL;

    useEffect(() => {
        if(password.password === password.checkPassword){
            setPassword(prevState => ({
                ...prevState,
                equals: true
            }));
        }else{
            setPassword(prevState => ({
                ...prevState,
                equals: false
            }));
        }
    }, [password.password, password.checkPassword])

    useEffect(() => {
        setPlace('Setting');
    }, [location.pathname])

    const handleChange = e => {
        const { name, value } = e.target;
        setPassword(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const deleteUser = () => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(DELETE_PROFILE)
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))

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
                setOk(false);
            }
        })
        .catch(err => console.log(err))

        history.push('/');
    }

    const updateUser = (select) => {
        if(select === 'username' && username){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(UPDATE_USERNAME),
                    variables: {
                        username
                    }
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            .then(res => {
                dispatchProfile({
                    type: 'UPDATE_PROFILE',
                    id_user: res.data.data.updateSetting.id_user,
                    username: res.data.data.updateSetting.username
                })
            })
            .catch(err => console.log(err))

            setUsername('');
        }else if(select === 'email' && email){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(UPDATE_EMAIL),
                    variables: {
                        email
                    }
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            .then(res => {
               dispatchProfile({
                   type: 'UPDATE_EMAIL',
                   id_user: res.data.data.updateSetting.id_user,
                   email: res.data.data.updateSetting.email
               }) 
            })
            .catch(err => console.log(err))

            setEmail('');
        }else if(select === 'password' && password.equals){
            axios({
                url: URL,
                method: 'POST',
                data: {
                    query: print(UPDATE_PASSWORD),
                    variables: {
                        password: password.password
                    }
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            .then(res => console.log(res))
            .catch(err => console.log(err))
            
            setPassword('');
        }else{
            console.log('nothing typed')
        }
    }

    return(
        <div className="container-setting">
            <div className="container-setting__cut">
                <div className="container-setting__dashboard">
                    <div>
                        <h3><FontAwesomeIcon icon={faCog} /></h3>
                        <h3>User setting</h3>
                    </div>
                    <ul>
                        <li>Account</li>
                    </ul>
                </div>
                <div className="container-setting__account">
                    <h3>Account settings</h3>
                </div>
                <div className="container-setting__account__modify">
                    <h4>Account preferences</h4>
                    <div className="container-setting__account__modify__space">
                        <div>
                            <div className="container-setting__account__modify__space__username">
                                <b>Username</b>
                                <input type="text" value={username || ''} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"/>
                            </div>
                            <div className="container-setting__account__modify__space__a">
                                <button onClick={() => updateUser('username')} disabled={profile.username === 'root'} style={profile.username === 'root' ? {opacity: "0.4"} : {}} title={profile.username === 'root' ? 'Cannot modify root credentials': undefined} >Change</button>
                            </div>
                        </div>
                        <div>
                            <div className="container-setting__account__modify__space__email">
                                <b>Email address</b>
                                <input type="text" value={email || ''} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                            </div>
                            <div className="container-setting__account__modify__space__a">
                                <button onClick={() => updateUser('email')} disabled={profile.username === 'root'} style={profile.username === 'root' ? {opacity: "0.4"} : {}} title={profile.username === 'root' ? 'Cannot modify root credentials' : undefined} >Change</button>
                            </div>
                        </div>
                        <div>
                            <div className="container-setting__account__modify__space__password">
                                <b>Password</b>
                                <span>Status: {password.equals ? 'Equal' : 'Not equal'}</span>
                                <div className="container-setting__account__modify__space__password__check">
                                    <input type="text" value={password.password || ''} name="password" onChange={handleChange} placeholder="Enter password" />
                                    <input type="text" value={password.checkPassword || ''} name="checkPassword" onChange={handleChange} placeholder="Enter again" />
                                </div>  
                            </div>
                            <div className="container-setting__account__modify__space__a">
                                <button onClick={() => updateUser('password')} disabled={!password.equals || profile.username === 'root'} style={profile.username === 'root' ? {opacity: "0.4"} : {}} title={profile.username === 'root' ? 'Cannot modify root credentials' : undefined} >Change</button>
                            </div>
                        </div>
                    </div>
                    <div className="container-setting__account__modify__delete">
                        <h4>Delete account</h4>
                        <div className="container-setting__account__modify__delete__button">
                            <button onClick={deleteUser} style={profile.username === 'root' ? {opacity: "0.4"} : {}} disabled={profile.username === 'root'} title={profile.username === 'root' ? 'Cannot modify root credentials' : undefined} >
                                <FontAwesomeIcon icon={faTrash} color={'rgb(255, 88, 91)'} />
                                <p>Delete</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {Setting as default}