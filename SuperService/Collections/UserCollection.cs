using Cloud77.Abstractions.Utility;
using Cloud77.Abstractions.Entity;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace SuperService.Collections
{
    public class UserMongoEntity : UserEntity
    {
        public ObjectId Id { get; set; }
    }

    public class UserCollection
    {
        private readonly IMongoCollection<UserMongoEntity> collection;

        public UserCollection(IMongoDatabase database)
        {
            collection = database.GetCollection<UserMongoEntity>("Users");
        }

        public UserCollection(MongoClient client, IConfiguration configuration)
        {
            var database = client.GetDatabase(configuration["Database"]);
            collection = database.GetCollection<UserMongoEntity>("Users");
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
            return document.Id.ToString();
        }

        public UserEntity GetUser(string email)
        {
            return collection.Find(Builders<UserMongoEntity>.Filter.Eq("Email", email)).FirstOrDefault();
        }

        // update user.confirmed
        public bool UpdateUser(string email, bool confirmed, string token)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            var update = Builders<UserMongoEntity>.Update.Set("Confirmed", confirmed);
            var ack = collection.UpdateOne(filter, update).IsAcknowledged;

            return ack;
        }

        // update user.profile
        public bool UpdateUser(string email, ProfileEntity profile)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            var update = Builders<UserMongoEntity>.Update.Set("Profile", profile);
            return collection.UpdateOne(filter, update).IsAcknowledged;
        }

        public IEnumerable<UserEntity> GetUsers(int index, int size, string sort, string role = "")
        {
            List<UserMongoEntity> entities;

            // Builders<BsonDocument>.Filter.Lt("id", 10) & Builders<BsonDocument>.Filter.Gte("id", 2)

            var filter = Builders<UserMongoEntity>.Filter.Empty;
            if (!string.IsNullOrEmpty(role))
            {
                filter = Builders<UserMongoEntity>.Filter.Eq("Role", role);
            }

            if (sort == "asc")
            {
                entities = collection
                    .Find(filter)
                    .Sort(Builders<UserMongoEntity>.Sort.Ascending("_id"))
                .Skip(index * size)
                    .Limit(size)
                    .ToList();
            }
            else
            {
                entities = collection
                    .Find(filter)
                    .Sort(Builders<UserMongoEntity>.Sort.Descending("_id"))
                    .Skip(index * size)
                    .Limit(size)
                    .ToList();
            }
            return entities;
        }
    }
}
