import React, {createContext, useState, useEffect} from 'react';

export const NightModeContext = createContext();

export const NightModeProvider = ({children}) => {
    const [night, setNight] = useState(undefined);

    useEffect(() => {
        if(night){
            document.documentElement.setAttribute('data-theme', 'dark');
        }else{
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, [night])

    return(
        <NightModeContext.Provider value={[night, setNight]}>
            {children}
        </NightModeContext.Provider>
    )
}