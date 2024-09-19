import { IQueryResult } from "./gateway"

export interface User {
    name: string | undefined,
    role: Role | undefined,
    title: string | undefined
}

export interface UserEmail {
    email: string
    existing: boolean
}

export interface UserRole {
    email: string
    name: string
    role: string
}

export interface UserPassword {
    email: string
    name: string
    password: string
}

export interface UserToken {
    email: string;
    value: string;
    refreshToken: string;
    issueAt: string;
    expireInHours: number;
}

export interface EmailToken {
    email: string
    token: string
}

export interface Profile {
    surname: string;
    givenName: string;
    city: string;
    phone: string;
    company: string;
    companyType: string;
    title: string;
    contact: string;
    fax: string;
    post: string;
    supplier: string;
}

export interface UserAccount {
    email: string,
    existing: boolean,
    confirmed: boolean,
    profile: Profile,
}

export interface AccountQueryResult extends IQueryResult {
    data: UserAccount[];
}

export interface UserProfile {
    email: string;
    data: Profile;
}

export interface UserTask {
    id: string;
    title: string;
    description: string;
    state: number;
}

export interface UserTasks extends IQueryResult {
    email: string;
    data: UserTask[];
}

export interface UserPost {
    id: string
    title: string;
    description: string;
}

export interface UserPosts extends IQueryResult {
    email: string;
    data: UserPost[];
}

export interface UserFiles extends IQueryResult {
    email: string;
    data: string[];
}

export enum Role {
    Visitor = "visitor",
    Tester = "tester",
    Admin = "admin",
}