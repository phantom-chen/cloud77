using Cloud77.Abstractions.Entity;
using MongoDB.Bson;
using MongoDB.Driver;

namespace UserService.Collections
{
    public class TaskMongoEntity : TaskEntity
    {
        public ObjectId Id { get; set; }
    }

    public class TaskCollection
    {
        private readonly IMongoCollection<TaskMongoEntity> collection;

        public TaskCollection(MongoClient client, IConfiguration configuration)
        {
            var database = client.GetDatabase(configuration["Database"]);
            collection = database.GetCollection<TaskMongoEntity>("Tasks");
        }

        public TaskCollection(IMongoDatabase database)
        {
            collection = database.GetCollection<TaskMongoEntity>("Tasks");
        }

        public IList<TaskMongoEntity> Get(string email)
        {
            return collection
                .Find(Builders<TaskMongoEntity>.Filter.Eq("Email", email))
                .ToList();
        }

        public string Create(string email, string title, string description)
        {
            var doc = new TaskMongoEntity()
            {
                Email = email,
                Title = title,
                Description = description,
                State = 0
            };
            collection.InsertOne(doc);
            return doc.Id.ToString();
        }

        public bool Update(string id, string title, string description, int completed)
        {
            var filter = Builders<TaskMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            var update = Builders<TaskMongoEntity>.Update
                .Set("Title", title)
                .Set("Description", description)
                .Set("State", completed);
            return collection.UpdateOne(filter, update).IsAcknowledged;
        }

        public bool Delete(string id)
        {
            var filter = Builders<TaskMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            return collection.DeleteOne(filter).IsAcknowledged;
        }

        public bool DeleteSome(string email)
        {
            var filter = Builders<TaskMongoEntity>.Filter.Eq("Email", email);
            return collection.DeleteMany(filter).IsAcknowledged;
        }

        public int Count()
        {
            var count = collection.CountDocuments(Builders<TaskMongoEntity>.Filter.Empty);
            return Convert.ToInt32(count);
        }
    }
}