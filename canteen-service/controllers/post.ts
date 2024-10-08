import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";

export function getPostList(): string[] {
    const files = readdirSync('./data/posts');
    if (files.length > 0) {
        return files;
    }
    return [];
}

export function getPost(id: string): string {
    if (!existsSync(`./data/posts/${id}`)) {
        savePost(id, "");
        return "";
    }
    return readFileSync(`./data/posts/${id}`).toString();
}

export function savePost(id: string, content: string): void {
    writeFileSync(`./data/posts/${id}`, content);
}

export function updatePostContent(id: string, content: string): void {
    const p = `./data/posts/${id}`;
    if (existsSync(p)) {
        writeFileSync(p, content);
    }
}