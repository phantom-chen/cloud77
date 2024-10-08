import { UserToken, GatewayService, UserEmail } from "@phantom-chen/cloud77";
import axios from "axios";

export function getGatewayApp(): Promise<GatewayService> {
    return axios<GatewayService>('/api/service/apps').then(res => {
        localStorage.setItem('apikey', res.data.apikey);
        localStorage.setItem('home', res.data.home);
        return Promise.resolve(res.data);
    }).catch(e => {
        console.log(e.message);
        return Promise.reject(e);
    });
}

export function getApp(name: string): void {
    axios.get('/super-app/service', {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }).then(res => {
        console.log(res.data);
    })
}

export function getHealth(name: string): void {
    axios.get('/user-app/health', {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        responseType: 'text'
    }).then(res => {
        console.log(res.data);
    })
}

export function verifyUser(email: string): void {
    axios.get('/identity-app/users', {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || ''
        },
        params: { email }
    }).then(res => {
        console.log(res.data);
    });    
}

export function getToken(user: { email: string, password: string }): Promise<UserToken> {
    return axios.get<UserToken>('/identity-app/users/tokens', {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || ''
        },
        params: {
            email: user.email,
            password: user.password
        }
    }).then(res => {
        localStorage.setItem('accessToken', res.data.value);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log(err);
        return Promise.reject(err);
    })
}

export function verifyToken(): Promise<UserEmail> {
    return axios.get<UserEmail>('/user-app/accounts/email', {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
    }).then(res => {
        return Promise.resolve(res.data)
    }).catch(err => {
        return Promise.reject(err);
    })
}