using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using MongoDB.Bson;
using MongoDB.Driver;

namespace SampleService.Collections
{
  public class AuthorMongoEntity : AuthorEntity
  {
    public ObjectId Id { get; set; }
  }

  public class AuthorCollection
  {
    private readonly IMongoCollection<AuthorMongoEntity> collection;

    public AuthorCollection(MongoClient client, string name)
    {
      var database = client.GetDatabase(name);
      collection = database.GetCollection<AuthorMongoEntity>("Authors");
    }

    public IList<Author> GetAuthors(int index, int size)
    {
      return collection
          .Find(Builders<AuthorMongoEntity>.Filter.Empty)
          .Skip(index * size)
          .Limit(size)
          .ToList()
          .Select(a =>
          {
            return new Author()
            {
              Id = a.Id.ToString(),
              Name = a.Name,
              Title = a.Title,
              Region = a.Region,
              Address = a.Address,
              CreatedAt = a.CreatedAt,

              UpdatedAt = a.UpdatedAt
            };
          }).ToList();
    }

    public string CreateAuthor(AuthorEntity entity)
    {
      var datetime = DateTime.UtcNow;
      var stamp = datetime.ToString("yyyyMMddHHmmss");
      var document = new AuthorMongoEntity()
      {
        Name = entity.Name,
        Title = entity.Title,
        Region = entity.Region,
        Address = entity.Address,
        CreatedAt = datetime,
        UpdatedAt = datetime
      };
      collection.InsertOne(document);
      return document.Id.ToString();
    }

    public bool UpdateAuthor(string id, AuthorEntity entity)
    {
      var filter = Builders<AuthorMongoEntity>.Filter.Eq("_id", new ObjectId(id));
      var datetime = DateTime.UtcNow;
      var update = Builders<AuthorMongoEntity>.Update
          .Set("Name", entity.Name)
          .Set("Title", entity.Title)
          .Set("Region", entity.Region)
          .Set("Address", entity.Address)
          .Set("UpdatedAt", datetime);

      return collection.UpdateOne(filter, update).IsAcknowledged;
    }

    public bool DeleteAuthor(string id)
    {
      var filter = Builders<AuthorMongoEntity>.Filter.Eq("_id", new ObjectId(id));
      return collection.DeleteOne(filter).IsAcknowledged;
    }

    public int Count()
    {
      var count = collection.CountDocuments(Builders<AuthorMongoEntity>.Filter.Empty);
      return Convert.ToInt32(count);
    }

    public bool Clear()
    {
      collection.Database.DropCollection("Authors");
      return true;
    }
  }
}
