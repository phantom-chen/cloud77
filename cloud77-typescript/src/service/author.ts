import { IQueryResult } from "./gateway";

export interface Author {
    name: string,
    title: string,
    region: string,
    address: string,
}

export interface AuthorEntity extends Author {
    id: string
    createdAt?: string,
    updatedAt?: string
}

export interface AuthorResult extends IQueryResult {
    data: AuthorEntity[];
}