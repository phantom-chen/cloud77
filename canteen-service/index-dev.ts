import * as dotenv from 'dotenv';
import { getFiles } from './models/files';
import { formatDateTimeWithLocalTimeZone, formatDateTimeCustomTimeZone, formatDateTimeWithTimeZone } from './models/date';dotenv.config();
import { randomUUID } from 'crypto';
import { generate } from 'randomstring';
import { generateID } from './models/guid';

const run = async (email: string) => {
    console.log(email);
    const items = await getFiles('dist');
    items.forEach(i => console.log(i));
    console.log(items.length);

    console.log(randomUUID());
    console.log(generate(7));
    console.log(generateID(6));
    
    // Examples of date time with time zone formatting
    console.log('Current date time with time zone examples:');
    console.log('ISO format:', formatDateTimeWithTimeZone());
    console.log('Local time zone:', formatDateTimeWithLocalTimeZone());
    console.log('Custom time zone (NY):', formatDateTimeCustomTimeZone(new Date(), 'America/New_York'));
    console.log('Custom time zone (Tokyo):', formatDateTimeCustomTimeZone(new Date(), 'Asia/Tokyo'));
    console.log('Custom time zone (London):', formatDateTimeCustomTimeZone(new Date(), 'Europe/London'));
}

run(process.env.EMAIL || '')
    .then(() => { console.log("done") });