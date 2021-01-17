import React, {createContext, useReducer} from 'react';
import mainReducer from '../reducers/mainReducer';

export const MainContext = createContext();

export const MainProvider = (props) => {

    const [main, dispatchMain] = useReducer(mainReducer, []);

    return(
        <MainContext.Provider value={[main, dispatchMain]}>
            {props.children}
        </MainContext.Provider>
    )

}