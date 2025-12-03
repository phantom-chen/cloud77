using Cloud77.Abstractions.Utility;
using Cloud77.Abstractions.Entity;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using Cloud77.Abstractions.Collection;

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

    public class EventCollection : IEventCollection
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

        public IEnumerable<EventEntity> GetEventLogs(string email)
        {
            var filter = Builders<EventMongoEntity>.Filter.Eq("Email", email);
            return collection
              .Find(filter)
              .Sort(Builders<EventMongoEntity>.Sort.Descending("_id"))
              .ToList();
        }

        public string CreateVerificationCode(string email)
        {
            var date = DateTime.UtcNow;
            string token = CodeGenerator.HashString(email.ToLower() + date.Millisecond.ToString() + CodeGenerator.GenerateDigitalCode(6));
            var usage = "verify-email";
            var payload = new TokenPayload()
            {
                Usage = usage,
                Token = token,
                Exp = date.AddHours(1)
            };
            AppendEventLog(new EventEntity()
            {
                Name = "Issue-Email-Token",
                UserEmail = email,
                Email = email,
                Payload = JsonConvert.SerializeObject(payload),
                Date = date,
            });
            return token;
        }

        public IEnumerable<TokenPayload> GetTokenPayloads(string email)
        {
            var logs = GetEventLogs(email).Where(l => l.Name == "Issue-Email-Token");
            var payloads = logs.Select(e => JsonConvert.DeserializeObject<TokenPayload>(e.Payload));
            return payloads;
        }

        public bool DeleteOne(string id)
        {
            var filter = Builders<EventMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            return collection.DeleteOne(filter).IsAcknowledged;
        }

        public IEnumerable<EventEntity> GetEventLogs(string name, int index, int size)
        {
            throw new NotImplementedException();
        }

        public bool DeleteSome(string email)
        {
            throw new NotImplementedException();
        }
    }
}
