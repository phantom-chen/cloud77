import { existsSync, mkdir } from "fs";

export function ensureFolders() {
    if (!existsSync('uploads')) {
        mkdir('uploads', err => {
            console.log(err);
        })
    }
    if (!existsSync('data')) {
        mkdir('data', err => {
            console.log(err);
        })
    }
    if (!existsSync('data/posts')) {
        mkdir('data/posts', err => {
            console.log(err);
        })
    }   
}