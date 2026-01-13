import { existsSync, readFileSync } from "fs";

// settings source
// 1. canteen.json
// 2. environment variables

type Settings = {
    service: string;
    database: string;
    issuer: string,
    audience: string,
    secretKey: string,
};

export function getSettings(): Settings {
    let file = 'canteen.production.json';

    if (!existsSync(file)) {
        file = 'canteen.development.json';
    }
    if (!existsSync(file)) {
        file = 'canteen.json';
    }

    if (!existsSync(file)) {
        return { service: '', database: '', issuer: '', audience: '', secretKey: '' };
    }

    const rawData = readFileSync(file, 'utf-8');
    const jsonData = JSON.parse(rawData) as Settings;
    return jsonData;
}