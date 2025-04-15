// data

import { appendFile, readFile, writeFile } from "fs";

// data/users.txt

// data/rooms
// data/rooms/room1.txt
// room1 has the users that join the room
// created by the user, timestamp
// then list the joined users

// data/documents.txt
// doc_id,user_name,doc_title
// data/documents/doc_id.txt

let count = 0;

export function serverConnected(): number {
    count++;
    return count;
}

export function serverDisConnected(): number {
    count--;
    return count;
}

export function connectedUsers(): number {
    return count;
}

export function appendConnection(id: string, username?: string): void {
    const filePath = `data/connections.txt`;
    const line = `${id}${username ? ' ' + username : ''}\n`;
    console.log(line);
    appendFile(filePath, line, (err) => {
        if (err) {
            console.error("Error appending to file:", err);
        } else {
            console.log("Line appended successfully to:", filePath);
        }
    });
}

export function removeConnection(id: string): void {
    const filePath = `data/connections.txt`;

    // Read the file, filter out the line, and write back
    readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        // Split the file content into lines
        const lines = data.split("\n");

        // Filter out lines that start with 'user_id'
        const updatedLines = lines.filter((line) => !line.startsWith(id));

        // Join the lines back into a single string
        const updatedContent = updatedLines.join("\n");


        // Write the updated content back to the file
        writeFile(filePath, updatedContent, "utf8", (err) => {
            if (err) {
                console.error("Error writing file:", err);
            } else {
                console.log("Line starting with 'user_id' removed successfully.");
            }
        });
    });
}
