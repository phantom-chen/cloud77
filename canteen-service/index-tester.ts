import * as dotenv from 'dotenv';
import { addRoom, deleteRoom, getRoom, getRooms, getRoomsForUser, getUsersInRoom, joinRoom, leaveRoom, updateRoom } from './models/room';
import { issueToken, getClaims } from './models/token';
import { countUsers, getUser } from './models/database/user';
import { createPost, createPosts, deletePost, getPosts } from './models/database/post';
import { createMongoClient, pingMongoServer } from './models/database/client';
import { getSettings } from './models/settings';
import { getTasks } from './models/database/task';
import { getAuthors } from './models/database/author';
import { getBookmarks } from './models/database/bookmark';

dotenv.config();

let isServer = false;
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
    if (!isServer && val === 'server') {
        isServer = true;
    }
});

// ready
// get rooms

// not implemented
// remove room

// join room, append line 'user id + room id' to connections.txt

// connection body: {user:'xxx', room:'yyy'}

// leave room, remove line 'user id + room id' from connections.txt


console.log("index-tester");

// updateRoom({
//     id: '123',
//     name: 'room4', // Test Room
//     description: 'A room for testing',
//     capacity: 5,
//     location: 'Test Location',
//     amenities: ['Test Amenity 1', 'Test Amenity 2'],
//     features: ['Test Feature 1', 'Test Feature 2'],
//     availability: {
//         monday: { open: '09:00', close: '17:00' },
//         tuesday: { open: '09:00', close: '17:00' },
//         wednesday: { open: '09:00', close: '17:00' },
//         thursday: { open: '09:00', close: '17:00' },
//         friday: { open: '09:00', close: '17:00' },
//         saturday: { open: '10:00', close: '16:00' },
//         sunday: { open: '', close: '' }
//     }
// });

const id = '123';

console.log(deleteRoom('123'));

getRooms().forEach(r => {
    // console.log(`room id: ${r.id}, name: ${r.name}`);
});

const room = getRoom(id);
if (room) {
    console.log(`Retrieved room: id=${room.id}, name=${room.name}`);
    console.log(`description: ${room.description}`);
    console.log(`capacity: ${room.capacity}`);
    console.log(`location: ${room.location}`);
    console.log(`amenities: ${room.amenities.join(', ')}`);
    console.log(`features: ${room.features.join(', ')}`);
    console.log(`availability:`);
    for (const [day, hours] of Object.entries(room.availability)) {
        console.log(`  ${day}: open=${hours.open}, close=${hours.close}`);
    }

} else {
    console.log(`Room with id ${id} not found.`);
}

// joinRoom('user3', 'room3');

// getUsersInRoom('room3').forEach(userId => {
//     console.log(`User in room3: ${userId}`);
// });

getRoomsForUser('user3').forEach(roomId => {
    console.log(`Room for user3: ${roomId}`);
});

// leaveRoom('user3', 'room3');

// const token = issueToken({ email: 'user@example.com', role: 'User' });
// console.log(`Issued token: ${token.value}`);

// const _token = 'xxx;
// getClaims(_token);

const email = '';

const run = async () => {
    const client = await createMongoClient();
    await client.connect();
    // await pingMongoServer(client, 'dev_db');

    const db = client.db('dev_db');
    // const result = await db.collection('Messages').insertOne({ message: 'Hello, world!' });
    // console.log(`Inserted message with ID: ${result.insertedId.toString()}`);

    const messages = await db.collection('Messages').find({}).toArray()
    console.log('Messages:');
    messages.forEach(m => {
        console.log(`- ${m.message}`);
    });

    await client.close();
    // const dbName = getSettings().database;
    // const user = await getUser(client, dbName, email);
    // const posts = await getPosts(client, dbName, email);
    // const tasks = await getTasks(client, dbName, email);

    // console.log(user);
    console.log('Posts:');
    // posts.forEach(p => {
    //     console.log(`- ${p.Title}: ${p.Description}`);
    // });

    // const newPostId = await createPost(client, dbName, email, {
    //     id: '',
    //     title: 'New Post Title',
    //     description: 'This is the description of the new post.'
    // })
    // console.log(`Created new post with ID: ${newPostId}`);

    // const newPostIds = await createPosts(client, dbName, email, [
    //     {
    //         id: '',
    //         title: 'Bulk Post 1',
    //         description: 'Description for Bulk Post 1'
    //     },
    //     {
    //         id: '',
    //         title: 'Bulk Post 2',
    //         description: 'Description for Bulk Post 2'
    //     }
    // ]);
    // console.log(`Created new posts with IDs: ${newPostIds.join(', ')}`);

    // deletePost(client, dbName, '').then(success => {
    //     console.log(`Deleted post: ${success}`);
    // });

    // console.log('Tasks:');
    // tasks.forEach(t => {
    //     console.log(`- ${t.Title}: ${t.Description} [State: ${t.State}]`);
    // });
}

const run2 = async () => {
    const client = await createMongoClient();
    const dbName = getSettings().database;
    const authors = await getAuthors(client, dbName);
    const bookmarks = await getBookmarks(client, dbName);
    console.log('Authors:');
    authors.forEach(a => {
        console.log(`- ${a.Name}, ${a.Title}, ${a.Region}, ${a.Address}`);
    });
    console.log('Bookmarks:');
    bookmarks.slice(0,2).forEach(b => {
        console.log(`- [${b.Collection}] ${b.Title} (${b.Href}) Tags: ${b.Tags}`);
    });
}

const run3 = async () => {
    const client = await createMongoClient();
    const dbName = getSettings().database;
    // add more tests here
    await countUsers(client, dbName).then(count => {
        console.log(`Total users: ${count}`);
    });
}

run();