import React, {useContext, useState, Fragment} from 'react';
import {HeaderContext} from '../context/HeaderContext';
import {REGISTRATION} from '../queries/profileQueries';
import {print} from 'graphql';
import axios from 'axios';

const ModelSignup = () => {
    const {s, l} = useContext(HeaderContext);

    const [sign, setSign] = s;

    const [login, setLogin] = l;
 
    const [password, setPassword] = useState('');

    const [email, setEmail] = useState('');

    const [username, setUsername] = useState('');

    const URL = process.env.REACT_APP_URL;

    const registrationOfUser = (e) => {
        e.preventDefault();
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(REGISTRATION),
                variables: {
                    username,
                    email,
                    password
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(res => {
            setSign(false);
            setLogin(true);
        })
        .catch(err => console.log(err))
    }

    if(!sign){
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
                    <div className="container-model__shape__two__signup">
                        <div className="container-model__shape__two__common__policy">
                            <div className="container-model__shape__two__common__policy__wrap">
                                <h3>Sign Up</h3>
                                <p>By continuing, you agree to our User Agreement and Privacy Policy.</p>
                            </div>
                        </div>
                        <div className="container-model__shape__two__common__buttons">
                            <div className="container-model__shape__two__common__buttons__wrap">
                                <input type="checkbox" name="agree"/>
                                <label><h6>I agree to get emails about cool stuff on Reddit</h6></label>
                                <button>Continue with google</button>
                                <button>Continue with apple</button>
                            </div>
                        </div>  
                        <div className="container-model__shape__two__common__or">
                            <h4>Or</h4>
                        </div>
                        <div className="container-model__shape__two__common__get">
                            <form className="container-model__form" onSubmit={registrationOfUser}>
                                <input type="text" value={username || ''} onChange={(e) => setUsername(e.target.value)} placeholder="username" autoComplete="off"/>
                                <input type="text" value={email || ''} onChange={(e) => setEmail(e.target.value)} placeholder="email" autoComplete="off"/>
                                <input type="password" value={password || ''} onChange={(e) => setPassword(e.target.value)} placeholder="password" autoComplete="off"/>
                                <input type="submit" value="Continue"/>
                            </form>
                            <p>Already a redditor? Log in</p>
                        </div>
                    </div>
                    <button onClick={() => setSign(false)}>X</button>
                </div>
            </div>
        </div>
    )
}


export {ModelSignup as default}