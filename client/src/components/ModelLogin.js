import React, {useContext, useState, Fragment} from 'react';
import { useHistory } from 'react-router-dom';
import {DO_LOGIN} from '../queries/profileQueries';
import {print} from 'graphql';
import {HeaderContext} from '../context/HeaderContext';
import {TokensContext} from '../context/TokensContext';
import axios from 'axios';

const ModelLogin = () => {
    const {l} = useContext(HeaderContext);   

    const {o} = useContext(TokensContext);

    const [, setOk] = o;

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [login, setLogin] = l;

    const history = useHistory();

    const URL = process.env.REACT_APP_URL;

    const loginSubmit = (e) => {
        e.preventDefault();

        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(DO_LOGIN),
                variables: {
                    email,
                    password
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            if(res.data.data.login){
                setOk(true)
            }
            history.go(0);
        })
        .catch(err => console.log(err))
        setLogin(false);
    }

    if(!login){
        return(
            <Fragment>
                
            </Fragment>
        )
    }

    return(
        <div className="container-model">
            <div className="container-model__shape">
                <div className="container-model__shape__one">
                </div>
                <div className="container-model__shape__two">
                    <div className="container-model__shape__two__login">
                        <div className="container-model__shape__two__common__policy">
                            <div className="container-model__shape__two__common__policy__wrap">
                                <h3>Login</h3>
                                <p>By continuing, you agree to our User Agreement and Privacy Policy.</p>
                            </div>
                        </div>
                        <div className="container-model__shape__two__common__buttons">
                            <div className="container-model__shape__two__common__buttons__wrap">
                                <button>Continue with google</button>
                                <button>Continue with apple</button>
                            </div>
                        </div>  
                        <div className="container-model__shape__two__common__or">
                            <h4>Or</h4>
                        </div>
                        <div className="container-model__shape__two__common__get">
                            <form className="container-model__form" onSubmit={loginSubmit}>
                                <input type="text" value={email || ''} onChange={(e) => setEmail(e.target.value)} placeholder="email" autoComplete="off"/>
                                <input type="password" value={password || ''} onChange={(e) => setPassword(e.target.value)} placeholder="password"/>
                                <input type="submit" value="Log in"/>
                            </form>
                            <p>Forgot your username or password?</p>
                            <p>New to Reddit? Sign up</p>
                        </div>
                    </div>
                    <button onClick={() => setLogin(false)}>X</button>
                </div>
            </div>
        </div>
    )
}

export {ModelLogin as default}