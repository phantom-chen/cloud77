using Cloud77.Abstractions.Collection;
using Cloud77.Abstractions.Entity;
using MongoDB.Bson;
using MongoDB.Driver;

namespace SuperService.Collections
{
    public class EventMongoEntity : EventEntity
    {
        public ObjectId Id { get; set; }
    }

    public class EventCollection
    {
        private readonly IMongoCollection<EventMongoEntity> collection;

        public EventCollection(IMongoDatabase database)
        {
            collection = database.GetCollection<EventMongoEntity>("Events");
        }

        public EventCollection(MongoClient client, IConfiguration configuration)
        {
            var database = client.GetDatabase(configuration["Database"]);
            collection = database.GetCollection<EventMongoEntity>("Events");
        }

        public string AppendEventLog(EventEntity entity)
        {
            var document = new EventMongoEntity()
            {
                Name = entity.Name,
                UserEmail = entity.Email,
                Email = entity.Email,
                Payload = entity.Payload,
                Date = DateTime.UtcNow
            };
            collection.InsertOne(document);
            return document.Id.ToString();
        }

        public string UpdateEventLog(string id, string payload)
        {
            var filter = Builders<EventMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            var update = Builders<EventMongoEntity>.Update.Set("Payload", payload);
            collection.UpdateOne(filter, update);
            return id;
        }

        public IEnumerable<EventEntity> GetEventLogs(string name, int index, int size)
        {
            return collection
              .Find(Builders<EventMongoEntity>.Filter.Eq("Name", name))
              .Sort(Builders<EventMongoEntity>.Sort.Descending("_id"))
              .Skip(index * size)
              .Limit(size)
              .ToList();
        }

        public IEnumerable<EventEntity> GetEventLogs(string email, string name)
        {
            var filter = Builders<EventMongoEntity>.Filter.Eq("Email", email);
            return collection
              .Find(filter)
              .Sort(Builders<EventMongoEntity>.Sort.Descending("_id"))
              .ToList();
        }

        public EventEntity GetEventLog(string id)
        {
            var filter = Builders<EventMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            return collection.Find(filter).Limit(1).FirstOrDefault();
        }

        public bool DeleteEventLog(string id)
        {
            var filter = Builders<EventMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            return collection.DeleteOne(filter).IsAcknowledged;
        }

        public bool DeleteEventLogs(string email, string name)
        {
            var filter = Builders<EventMongoEntity>.Filter.Eq("Email", email);
            if (!string.IsNullOrEmpty(name))
            {
                filter = Builders<EventMongoEntity>.Filter.And(
                    Builders<EventMongoEntity>.Filter.Eq("Email", email),
                    Builders<EventMongoEntity>.Filter.Eq("Name", name));
            }
            return collection.DeleteMany(filter).IsAcknowledged;
        }
    }
}
