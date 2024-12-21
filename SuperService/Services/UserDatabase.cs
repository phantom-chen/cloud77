using Cloud77.Service;
using Cloud77.Service.Entity;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace SuperService.Services
{
    public class UserMongoEntity : UserEntity
    {
        public ObjectId Id { get; set; }
        public string License { get; set; }
        public string Devices { get; set; }
    }
    
    public class EventMongoEntity : EventEntity
    {
        public ObjectId Id { get; set; }
    }

    public class SettingMongoEntity : SettingEntity
    {
        public ObjectId Id { get; set; }
    }

    public class UserDatabase
    {
        private readonly IMongoCollection<UserMongoEntity> collection;
        private readonly IMongoCollection<EventMongoEntity> _collection;

        public UserDatabase(IMongoDatabase database)
        {
            collection = database.GetCollection<UserMongoEntity>(Cloud77Utility.Users);
            _collection = database.GetCollection<EventMongoEntity>(Cloud77Utility.Events);
        }

        public UserDatabase(MongoClient client, IConfiguration configuration)
        {
            var database = client.GetDatabase(configuration["Database"]);
            collection = database.GetCollection<UserMongoEntity>(Cloud77Utility.Users);
            _collection = database.GetCollection<EventMongoEntity>(Cloud77Utility.Events);
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
            _collection.InsertOne(document);
            return document.Id.ToString();
        }

        public IEnumerable<EventEntity> GetEventLogs(string email)
        {
            // TODO event logs related to user self
            var filter = Builders<EventMongoEntity>.Filter.And(
                Builders<EventMongoEntity>.Filter.Eq("Email", email),
                Builders<EventMongoEntity>.Filter.Or(
                    Builders<EventMongoEntity>.Filter.Eq("Name", "Issue-Email-Token"),
                    Builders<EventMongoEntity>.Filter.Eq("Name", "Verify-Email"),
                    Builders<EventMongoEntity>.Filter.Eq("Name", "Reset-Password")));
            return _collection.Find(filter).ToList();
        }

        public string CreateUser(UserEntity user)
        {
            var document = new UserMongoEntity()
            {
                Email = user.Email,
                Role = user.Role,
                Name = user.Name,
                Password = user.Password,
            };
            collection.InsertOne(document);

            var date = DateTime.UtcNow;
            var log = new EventEntity()
            {
                Name = "Create-User",
                UserEmail = user.Email,
                Email = user.Email,
                Date = date,
            };
            AppendEventLog(log);

            return document.Id.ToString();
        }

        public UserEntity GetUser(string email)
        {
            return collection.Find(Builders<UserMongoEntity>.Filter.Eq("Email", email)).FirstOrDefault();
        }

        public string CreateVerificationCode(string email)
        {
            var date = DateTime.UtcNow;
            string token = CodeGenerator.HashString(email.ToLower() + date.Millisecond.ToString()); // TODO add salt or secret
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

        public bool UpdateUser(string email, bool confirmed)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            var update = Builders<UserMongoEntity>.Update.Set("Confirmed", confirmed);
            return collection.UpdateOne(filter, update).IsAcknowledged;
        }

        public bool UpdateUser(string email, ProfileEntity profile)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            var update = Builders<UserMongoEntity>.Update.Set("Profile", profile);
            return collection.UpdateOne(filter, update).IsAcknowledged;
        }

        public IEnumerable<TokenPayload> GetTokenPayloads(string email)
        {
            var logs = GetEventLogs(email);
            var payloads = logs.Select(e => JsonConvert.DeserializeObject<TokenPayload>(e.Payload));
            return payloads;
        }
    }

    public class SettingCollection
    {
        private readonly IMongoCollection<SettingMongoEntity> collection;

        public SettingCollection(MongoClient client, IConfiguration configuration)
        {
            var database = client.GetDatabase(configuration["Database"]);
            collection = database.GetCollection<SettingMongoEntity>(Cloud77Utility.Settings);
        }

        public string Create(SettingEntity entity)
        {
            var doc = new SettingMongoEntity()
            {
                Key = entity.Key,
                Value = entity.Value,
                Description = entity.Description
            };
            collection.InsertOne(doc);
            return doc.Id.ToString();
        }

        public IEnumerable<SettingEntity> Get()
        {
            var filter = Builders<SettingMongoEntity>.Filter.Empty;
            var settings = collection.Find(filter).ToList();
            return settings.Select(setting => new SettingEntity()
            {
                Key = setting.Key,
                Value = setting.Value,
                Description = setting.Description
            });
        }
    }
}
