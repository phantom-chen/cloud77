import * as dotenv from 'dotenv';
import { addRoom, deleteRoom, getRoom, getRooms, getRoomsForUser, getUsersInRoom, joinRoom, leaveRoom, updateRoom } from './models/room';
import { issueToken, getClaims } from './models/token';

dotenv.config();

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

const _token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiVXNlciIsImlhdCI6MTc2Nzg2Njk4MywiZXhwIjoxNzY3OTUzMzgzLCJhdWQiOiJhdWRpZW5jZSIsImlzcyI6Imlzc3VlciJ9.kww6wh0JU--kXO3yQgkwF4O31V-a8KP-_Xcyi8Mn0LA';

getClaims(_token);