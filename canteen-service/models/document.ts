import { join } from "path";
import { localData } from "./local-data";
import { accessSync, existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";

const root = join(localData(), 'documents');

export function getDocuments(): { id: string, title: string }[] {
    console.log("Getting documents");
        const files = readdirSync(root);
    if (files.length > 0) {
        return files.map(f => {
            const lines = readFileSync(join(root, f)).toString().split('\n');
            return { id: f, title: lines[0].trim() || 'Untitled Document' };
        });
    }
    return [];
}

export function getDocument(id: string): { title: string, content: string } {
    console.log("Getting a single document");
    if (!existsSync(`${root}/${id}`)) {
        writeFileSync(`${root}/${id}`, 'Untitled Document');
        return { title: 'Untitled Document', content: '' };
    }

    const lines = readFileSync(join(root, id)).toString().split('\n');
    return { title: lines[0].trim() || 'Untitled Document', content: lines.slice(1).join('\n') };
}

export function createDocument(id: string, title: string): void {
    console.log("Creating document");
    writeFileSync(`${root}/${id}`, title || 'Untitled Document');
}

export function deleteDocument(id: string): void {
    console.log("Deleting document");
    
    if (existsSync(`${root}/${id}`)) {
        accessSync(`${root}/${id}`);
        unlinkSync(`${root}/${id}`);
    }
}

export function updateDocument(id: string, content: string): void {
    console.log("Updating document");
    const lines = readFileSync(join(root, id)).toString().split('\n');
    writeFileSync(`${root}/${id}`, lines[0] + '\n' + content);
}

export function updateTitle(id: string, title: string): void {
    console.log("Updating document title");
    const lines = readFileSync(join(root, id)).toString().split('\n');
    writeFileSync(`${root}/${id}`, title + '\n' + lines.slice(1).join('\n'));
}