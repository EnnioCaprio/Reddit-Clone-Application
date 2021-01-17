import React from 'react';
import { useHistory } from 'react-router-dom';

const Community = ({value}) => {

    const history = useHistory();

    const sendToMain = (id) => {
        history.push({
            pathname: `/main/${id}`,
            state: {
                id
            }
        })
    }

    return(
        <div className="container-side__community">
            <div className="container-side__community__background">
                <p>Top Communities</p>
            </div>
            <div className="container-side__community__items">
                <ul>
                    {
                        value.map(v => (
                            <li key={v.id_main}>
                                <div onClick={() => {
                                    sendToMain(v.id_main);
                                }}>
                                    <span></span>
                                    <p>r/{v.name}</p>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export {Community as default}