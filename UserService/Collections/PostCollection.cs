using MongoDB.Bson;
using MongoDB.Driver;

namespace UserService.Collections
{
    public class PostMongoEntity
    {
        public ObjectId Id { get; set; }
        public string Email { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }

    public class PostCollection
    {
        private readonly IMongoCollection<PostMongoEntity> collection;

        public PostCollection(MongoClient client, IConfiguration configuration)
        {
            var database = client.GetDatabase(configuration["Database"]);
            collection = database.GetCollection<PostMongoEntity>("Posts");
        }

        public PostCollection(IMongoDatabase database)
        {
            collection = database.GetCollection<PostMongoEntity>("Posts");
        }

        public IList<PostMongoEntity> Get(string email)
        {
            return collection
                .Find(Builders<PostMongoEntity>.Filter.Eq("Email", email))
                .ToList();
        }

        public string Create(string email, string title, string description)
        {
            var doc = new PostMongoEntity()
            {
                Email = email,
                Title = title,
                Description = description,
            };
            collection.InsertOne(doc);
            return doc.Id.ToString();
        }

        public bool DeleteSome(string email)
        {
            var filter = Builders<PostMongoEntity>.Filter.Eq("Email", email);
            return collection.DeleteMany(filter).IsAcknowledged;
        }

        public bool Delete(string id)
        {
            var filter = Builders<PostMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            return collection.DeleteOne(filter).IsAcknowledged;
        }

        public int Count()
        {
            var count = collection.CountDocuments(Builders<PostMongoEntity>.Filter.Empty);
            return Convert.ToInt32(count);
        }
    }
}
