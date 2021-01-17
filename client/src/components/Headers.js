import React, {Fragment, useContext} from 'react';
import HeaderCore from './HeaderCore';
import MainHeader from './MainHeader';
import { TokensContext } from '../context/TokensContext';

const Headers = () => {

    const {a} = useContext(TokensContext);

    const [auth,] = a;

    return(
        <Fragment>
            {
                auth === true ? <MainHeader /> : <HeaderCore />
            }
        </Fragment>
    )
}
export {Headers as default}