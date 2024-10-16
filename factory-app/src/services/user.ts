import { Device, License, Profile, UserFiles } from "@phantom-chen/cloud77";
import axios from "axios";
// import FormData from 'form-data';

export interface UserAccount {
    name: string;
    email: string;
    role: string;
    confirmed: boolean;
    profile?: Profile;
    license?: License;
    devices?: Device[];
}

export function getAccount(email: string): Promise<UserAccount> {
    return axios.get<UserAccount>(`/user-app/accounts/${email}`, {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
    }).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getTasks(email: string): void {
    axios.get<UserAccount>(`/user-app/tasks`, {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: { email }
    }).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    })
}

export function getFiles(email: string): Promise<string[]> {
    return axios.get<UserFiles>(`/canteen-app/files/list`, {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: { email }
    }).then(res => {
        return Promise.resolve(res.data.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getPosts(email: string): void {
    axios.get<UserAccount>(`/canteen-app/posts`, {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: { email }
    }).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    })
}

export function uploadFile(email: string, data: FormData) {
    axios.post('/canteen-app/files', data, {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
        },
        params: {
            email
        }
    }).then(res => {
        console.log(res.data);        
    }).catch(err => {

    })
}