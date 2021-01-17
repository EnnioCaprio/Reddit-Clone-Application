import React, {createContext, useState, useEffect} from 'react';

export const HeaderContext = createContext();

export const HeaderProvider = (props) => {
    const [login, setLogin] = useState(undefined);

    const [sign, setSign] = useState(undefined);

    const [place, setPlace] = useState('');

    useEffect(() => {
        if(login){
            document.body.style.overflowY = 'hidden';
        }else{
            document.body.style.overflowY = 'scroll';
        }
    }, [login])

    useEffect(() => {
        if(sign){
            document.body.style.overflowY = 'hidden';
        }else{
            document.body.style.overflowY = 'scroll';
        }
    }, [sign])

    return(
        <HeaderContext.Provider value={{ l: [login, setLogin], s: [sign, setSign], p: [place, setPlace]}}>
            {props.children}
        </HeaderContext.Provider>
    )
}