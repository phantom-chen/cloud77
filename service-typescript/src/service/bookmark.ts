import { IQueryResult } from "./gateway";

export interface BookmarkEntity {
    id: string;
    href: string;
    title: string;
    tags: string;
    collection: string;
}

export interface BookmarkResult extends IQueryResult {
    data: BookmarkEntity[]
}