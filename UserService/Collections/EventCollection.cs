using Cloud77.Abstractions.Entity;
using MongoDB.Bson;
using MongoDB.Driver;

namespace UserService.Collections
{
    public class EventMongoEntity : EventEntity
    {
        public ObjectId Id { get; set; }
    }

    public class TokenPayloadBase
    {
        public string Token { get; set; } = "";
    }
    public class RolePayload
    {
        public string Role { get; set; } = "";
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

        public IEnumerable<EventEntity> GetEventLogs(string email, string name)
        {
            var filter = Builders<EventMongoEntity>.Filter.Eq("Email", email);
            return collection
              .Find(filter)
              .Sort(Builders<EventMongoEntity>.Sort.Descending("_id"))
              .ToList();
        }

        public string UpdateEventLog(string id, string payload)
        {
            var filter = Builders<EventMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            var update = Builders<EventMongoEntity>.Update.Set("Payload", payload);
            collection.UpdateOne(filter, update);
            return id;
        }

        public EventEntity GetEventLog(string id)
        {
            var filter = Builders<EventMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            return collection.Find(filter).Limit(1).FirstOrDefault();
        }
    }
}
