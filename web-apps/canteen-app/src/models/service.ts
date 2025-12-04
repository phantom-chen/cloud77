import axios from 'axios';
import { getKey } from './storage';
// import FormData from 'form-data';

export interface AccountPayload {
    token: string;
    email: string;
    user: string;
}

export function getGateway(): Promise<string> {
    return axios.get("api/gateway").then((response) => {
        const data = response.data;
        console.log(data);
        localStorage.setItem('api_key', data.key);
        return Promise.resolve(data.key);
    });
}

export function getFiles(): Promise<string[]> {
    return axios.get(`/api/canteen/uploads`, {
        headers: {
            'x-api-key': getKey()
        }
    }).then(res => {
        return Promise.resolve(res.data.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function uploadFile(data: FormData) {
    axios.post('/api/canteen/uploads', data, {
        headers: {
            'x-api-key': getKey(),
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        console.log(res.data);        
    }).catch(err => {

    })
}