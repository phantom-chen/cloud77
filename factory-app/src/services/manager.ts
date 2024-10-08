import { IQueryResult, License, AccountQueryResult } from "@phantom-chen/cloud77";
import axios from "axios";

export function getAccounts(page: number, size: number): Promise<AccountQueryResult> {
    return axios.get<AccountQueryResult>('/user-app/accounts', {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
            role: 'User',
            index: page,
            size
        }
    }).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export interface UserLicense {
    email: string;
    license: License;
}

export interface LicenseQueryResult extends IQueryResult {
    data: UserLicense[];
}

export function getLicenses(query: {
    page: number, size: number, email: string
}): Promise<UserLicense[]> {
    return axios.get<LicenseQueryResult>('/hex-app/licenses', {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
            index: query.page,
            size: query.size,
            email: query.email
        }
    }).then(res => {
        return Promise.resolve(res.data.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getUserLogs(email: string) {
    axios.get('/user-app/events/emails', {
        headers: {
            'x-api-key': localStorage.getItem('apikey') || '',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
            index: 0,
            size: 50,
            email
        }
    }).then(res => {
        console.log(res.data);        
    }).catch(err => {

    })
}
