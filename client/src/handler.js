import React, {useEffect, useRef} from 'react';

const months = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    })
    return ref.current;
} 

export const changeFormatMessage = (date) => {
    const transform = new Date(parseInt(date));

    let minutes = transform.getMinutes();

    if(minutes.length > 2){
        minutes = parseInt('0' + minutes);
    }

    const customDate = `${transform.getHours()}:${minutes}`;

    return customDate
}

export const changeFormat = (date) => {
    const transform = new Date(parseInt(date));

    const splitDate = transform.toISOString().split('T');

    const splitDateOne = splitDate[0];

    const splitDateTwo = splitDate[1].split('.');

    const customDate = `${splitDateOne} ${splitDateTwo[0]}`

    return customDate;
}

export const formatUser = (date) => {
    const transform = new Date(parseInt(date));

    const day = transform.getDate();

    const month = months[transform.getMonth()];

    const year = transform.getFullYear();

    const fullDate = `${day} ${month} ${year}`;

    return fullDate;
}