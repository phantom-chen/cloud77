import axios from "axios";
import { getAuthorization, getKey, updateKey, updateSSOUrl } from "./storage";
import { Profile, UserAccount } from "@phantom-chen/cloud77";
import { AccountQueryResult } from "@phantom-chen/cloud77";

export const TesterProfile: Profile = {
  city: 'a', company: 'a', companyType: 'a', contact: 'a', fax: 'a', phone: 'a', post: 'a', givenName: 'a', surname: 'a', supplier: 'a', title: 'a'
}

export const TesterAccount: UserAccount = {
  email: 'xxx', name: 'xxx', confirmed: false, existing: false, profile: TesterProfile
}

export function getGateway(): Promise<string> {
  return axios.get("api/gateway").then((response) => {
    console.log(response.data);
    const data = response.data;
    console.log(data);

    updateSSOUrl(data.sso);
    localStorage.setItem("home_url", data.home);
    updateKey(data.key);

    return Promise.resolve(data.key);
  });
}

export function getToken(user: {
  email: string;
  password: string;
}): Promise<string> {
  return axios.post(
      "api/sso/tokens",
      {
        email: user.email,
        password: user.password,
      },
      {
        headers: {
          "x-api-key": getKey(),
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      const data = response.data;
      sessionStorage.setItem("user_access_token", data.value);
      sessionStorage.setItem("user_refresh_token", data.refreshToken);

      return Promise.resolve(data.value ?? '');
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject('');
    });
}

export type AppSetting = {
    key: string,
    value: string,
    description: string
}

export function getSettings(): Promise<AppSetting[]> {
    return axios<AppSetting[]>('/api/user/settings', {
        headers: {
            'x-api-key': getKey(),
            'Authorization': getAuthorization(),
        },
    }).then(res => {
        return Promise.resolve(res.data);
    }).catch(e => {
        console.log(e.message);
        return Promise.reject(e);
    });
}

export function getRole(): Promise<string> {
    return axios.get('/api/user/accounts/role', {
        headers: {
            'x-api-key': getKey(),
            'Authorization': getAuthorization(),
        }
    }).then(res => {
        console.log(res.data);
        sessionStorage.setItem('user_email', res.data.email);
        return Promise.resolve(res.data.role);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getUser(email: string): void {
    axios.get('/api/sso/users', {
        headers: {
            'x-api-key': getKey()
        },
        params: { email }
    }).then(res => {
        console.log(res.data);
    });    
}

export function getAccount(email: string): Promise<UserAccount> {
    return axios.get<UserAccount>(`/api/user/accounts/${email}`, {
        headers: {
            'x-api-key': getKey(),
            'Authorization': getAuthorization(),
        }
    }).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getApp(name: string): void {
    axios.get(`/api/${name}/service`, {
        headers: {
            'x-api-key': getKey(),
            'Authorization': getAuthorization()
        }
    }).then(res => {
        console.log(res.data);
    })
}

export function getHealth(name: string): void {
    axios.get(`/api/${name}/health`, {
        headers: {
            'x-api-key': getKey(),
            'Authorization': getAuthorization(),
        },
        responseType: 'text'
    }).then(res => {
        console.log(res.data);
    })
}

export function getAccounts(page: number, size: number): Promise<AccountQueryResult> {
  return axios.get<AccountQueryResult>('/user-app/accounts', {
    headers: {
      'x-api-key': getKey(),
      'Authorization': getAuthorization(),
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

export function getUserLogs(email: string) {
  axios.get('/user-app/events/emails', {
    headers: {
      'x-api-key': getKey(),
      'Authorization': getAuthorization(),
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

export function getTasks(email: string): void {
    axios.get<UserAccount>(`/user-app/tasks`, {
        headers: {
            'x-api-key': getKey(),
            'Authorization': getAuthorization(),
        },
        params: { email }
    }).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    })
}

export function getPosts(email: string): void {
    axios.get<UserAccount>(`/canteen-app/posts`, {
        headers: {
            'x-api-key': getKey(),
            'Authorization': getAuthorization(),
        },
        params: { email }
    }).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    })
}