import { GET_MAIN, JOINING_MAIN, REMOVE_MAIN} from '../queries/mainQueries';
import { print } from 'graphql';
import axios from 'axios';

const URL = process.env.REACT_APP_URL;

const Join = {
    handlesGet: async (id) => {
        const response = await axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(GET_MAIN),
                variables: {
                    id_main: id
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        
        return response;
    },
    handlesJoin: async (id) => {
        const response = await axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(JOINING_MAIN),
                variables: {
                    id
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })
        
        return response;
    },
    handlesNotJoin: async (id) => {
        const res = await axios({
            url: URL,
            method: 'POST',
            data: {
                query: print(REMOVE_MAIN),
                variables: {
                    id
                }
            },
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true
        })

        return res;
    }
}

export {Join as default}