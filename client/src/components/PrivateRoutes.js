import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {TokensContext} from '../context/TokensContext';

const PrivateRoutes = ({ component: Component, ...rest }) => {
    const {a} = useContext(TokensContext);
    const [auth,] = a;
    return(
        <Route 
            {...rest}
            render={
                (props) => (
                    auth === true ? 
                    ( <Component {...props} {...rest} /> )
                    : ( <Redirect to={{
                        pathname: '/',
                        state: { 
                            from: props.location
                        }
                    }} /> 
                    )
                )
            }
        />
    )
}

export {PrivateRoutes as default}