import { IQueryResult } from "./gateway";

export interface AuthorEntity {
    id: string
    name: string,
    title: string,
    region: string,
    address: string,
    createdAt?: string,
    updatedAt?: string
}

export interface AuthorResult extends IQueryResult {
    data: AuthorEntity[];
}