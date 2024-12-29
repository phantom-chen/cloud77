using Cloud77.Service;
using Cloud77.Service.Entity;
using MongoDB.Bson;
using MongoDB.Driver;

namespace UserService.Controllers
{
    public class SettingMongoEntity : SettingEntity
    {
        public ObjectId Id { get; set; }
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
