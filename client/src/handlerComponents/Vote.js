import {ADD_VOTE, REMOVE_VOTE, UPDATE_VOTE, RESTORE_VOTE} from '../queries/homeQueries'
import {print} from 'graphql';
import axios from 'axios';

const URL = process.env.REACT_APP_URL;

let source = axios.CancelToken.source();

const Vote = {
    handlesAdd: (id) => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(ADD_VOTE),
                variables: {
                    id_thread: id
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true,
            cancelToken: source.token
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            if(axios.isCancel(err)){
                console.log('removed')
            }else{
                console.log(err)
            }
        })
    },
    handlesRemove: (id) => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(REMOVE_VOTE),
                variables: {
                    id_thread: id
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true,
            cancelToken: source.token
        })
        .then(resp => resp)
        .catch(err => {
            if(axios.isCancel(err)){
                console.log('removed')
            }else{
                console.log(err)
            }
        })
    },
    handlesUpdate: (id, vote) => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(UPDATE_VOTE),
                variables: {
                    id_thread: id,
                    status_vote: vote
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true,
            cancelToken: source.token
        })
        .then(res => res)
        .catch(err => {
            if(axios.isCancel(err)){
                console.log('removed update')
            }else{
                console.log(err)
            }
        })
    },
    handlesBack: (id, vote) => {
        axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(RESTORE_VOTE),
                variables: {
                    id_thread: id,
                    status_vote: vote
                }
            },
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(res => res)
        .catch(err => console.log(err))
    }
}

export {Vote as default}