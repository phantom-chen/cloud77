db = new Mongo().getDB("dev_db");

db.createCollection('Messages', { capped: false });

db.Messages.insert([
    { "message": "first message from mongodb" },
])
