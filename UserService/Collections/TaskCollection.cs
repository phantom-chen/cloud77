using Cloud77.Service;
using Cloud77.Service.Entity;
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
            collection = database.GetCollection<TaskMongoEntity>(Cloud77Utility.Tasks);
        }

        public IList<TaskMongoEntity> GetTasks(string email, int index, int size)
        {
            return collection
                .Find(Builders<TaskMongoEntity>.Filter.Eq("Email", email))
                .Skip(index * size)
                .Limit(size)
                .ToList();
        }

        public string CreateTask(string email, string title, string description)
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

        public bool UpdateTask(string id, string title, string description, int completed)
        {
            var filter = Builders<TaskMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            var update = Builders<TaskMongoEntity>.Update
                .Set("Title", title)
                .Set("Description", description)
                .Set("State", completed);
            return collection.UpdateOne(filter, update).IsAcknowledged;
        }

        public bool DeleteTask(string id)
        {
            return collection.DeleteOne(Builders<TaskMongoEntity>.Filter.Eq("_id", new ObjectId(id))).IsAcknowledged;
        }

        public int CountTasks()
        {
            var count = collection.CountDocuments(Builders<TaskMongoEntity>.Filter.Empty);
            return Convert.ToInt32(count);
        }
    }
}