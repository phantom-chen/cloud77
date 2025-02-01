using Cloud77.Service;
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

        public IList<PostMongoEntity> GetPosts(string email, int index, int size)
        {
            return collection
                .Find(Builders<PostMongoEntity>.Filter.Eq("Email", email))
                .Skip(index * size)
                .Limit(size)
                .ToList();
        }
    }
}
