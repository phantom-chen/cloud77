using Cloud77.Abstractions.Collection;
using Cloud77.Abstractions.Entity;
using MongoDB.Bson;
using MongoDB.Driver;

namespace UserService.Collections
{
    public class UserMongoEntity : UserEntity
    {
        public ObjectId Id { get; set; }
    }

    public class UserCollection : IUserCollection
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

        public IEnumerable<UserEntity> GetUsers(int index, int size, string sort)
        {
            throw new NotImplementedException();
        }

        public UserEntity GetUser(string email)
        {
            return collection.Find(Builders<UserMongoEntity>.Filter.Eq("Email", email)).FirstOrDefault();
        }

        public UserEntity GetUserByName(string name)
        {
            return collection.Find(Builders<UserMongoEntity>.Filter.Eq("Name", name)).FirstOrDefault();
        }

        // update user.confirmed
        public bool ConfirmUser(string email, bool confirmed)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            var update = Builders<UserMongoEntity>.Update.Set("Confirmed", confirmed);
            var ack = collection.UpdateOne(filter, update).IsAcknowledged;

            return ack;
        }

        // update user.profile
        public bool UpdateProfile(string email, ProfileEntity profile)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            var update = Builders<UserMongoEntity>.Update.Set("Profile", profile);
            return collection.UpdateOne(filter, update).IsAcknowledged;
        }

        // update user.password
        public bool UpdatePassword(string email, string password)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            var update = Builders<UserMongoEntity>.Update.Set("Password", password);
            var ack = collection.UpdateOne(filter, update).IsAcknowledged;

            return ack;
        }

        // update user.role
        public bool UpdateRole(string email, string role)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            var update = Builders<UserMongoEntity>.Update.Set("Role", role);
            var ack = collection.UpdateOne(filter, update).IsAcknowledged;
            return ack;
        }

        // update user.name
        public bool UpdateName(string email, string name)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            var update = Builders<UserMongoEntity>.Update.Set("Name", name);
            var ack = collection.UpdateOne(filter, update).IsAcknowledged;
            return ack;
        }

        public bool DeleteUser(string email)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            return collection.DeleteOne(filter).IsAcknowledged;
        }
    }
}
