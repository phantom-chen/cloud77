import { readFileSync } from "fs";

// settings source
// canteen.json
// environment variables

type Settings = {
    service: string;
    database: string;
};

export function getSettings(): Settings {
    const file = 'canteen.json';
    const rawData = readFileSync(file, 'utf-8');
    const jsonData = JSON.parse(rawData) as Settings;
    return jsonData;
}