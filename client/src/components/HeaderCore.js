import React, {Fragment, useContext, useState} from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { HeaderContext } from '../context/HeaderContext';
import { NightModeContext } from '../context/NightModeContext';
import gql from 'graphql-tag';
import { print } from 'graphql';
import axios from 'axios';

const HeaderCore = () => { 
    const {l, s} = useContext(HeaderContext);

    const [user, setUser] = useState(undefined);

    const [night, setNight] = useContext(NightModeContext);

    const [aSearch, setASearch] = useState(undefined);

    const [mainResult, setMainResult] = useState(undefined);

    const [, setLogin] = l

    const [, setSign] = s

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

    return(
        <Fragment>
            <div className="header clearfix">
                <div className="header-left__core">
                    <div className="header-left__group">
                        <div className="header-logo__core">
                            <NavLink to="/">
                                <span>
                                    <h5>Reddit</h5>
                                    <FontAwesomeIcon icon={faHome} size="1x"/>
                                </span>
                            </NavLink>
                        </div> 
                        <div className="header-center__core" onClick={() => setASearch(!aSearch)}>
                            <input type="text" onKeyPress={(e) => search(e)} placeholder="search"/>
                            <div className={aSearch ? "header-center__core__result" : ""}>
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
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-right__core">
                    <div className="header-right__core__float">
                        <ul className="header-links__core">
                            <li onClick={() => setLogin(true)}>LOG IN</li>
                            <li onClick={() => setSign(true)}>SIGN UP</li>
                        </ul>
                    </div>
                    <div className="header-right__core__user">
                        <span onClick={() => setUser(!user)}><FontAwesomeIcon icon={faUser} /></span>
                        {
                            user &&
                            <div className="header-right__core__list">
                                <div>
                                    <p>View option</p>
                                    <ul>
                                        <li>
                                            <p>Night Mode</p>
                                            <i className="header-night" onClick={() => setNight(!night)} style={night ? {justifyContent: 'flex-end', background: '#0079d3'} : {}}>
                                                <span></span>
                                            </i>
                                        </li>
                                    </ul>
                                    <p>More stuff</p>
                                    <ul className="header-links__core">
                                        <li onClick={() => setLogin(true)}>Log In</li>
                                        <li onClick={() => setSign(true)}>Sign Up</li>
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export {HeaderCore as default}