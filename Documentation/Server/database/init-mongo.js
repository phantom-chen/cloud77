db = new Mongo().getDB("tester0");
db.createCollection('Messages', { capped: false });

db.Messages.insert([
    { "message": "first message from mongodb" },
]);