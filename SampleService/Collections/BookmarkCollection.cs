using Cloud77.Service;
using MongoDB.Bson;
using MongoDB.Driver;

namespace SampleService.Collections
{
  public class BookmarkMongoEntity
  {
    public ObjectId Id { get; set; }
    public string Title { get; set; }
    public string Href { get; set; }
    public string Tags { get; set; }
    public string Collection { get; set; }
  }

  public class BookmarksResult : QueryResults
  {
    public BookmarkMongoEntity[] Data = Array.Empty<BookmarkMongoEntity>();
  }

  public class BookmarkCollection
  {
    private readonly IMongoCollection<BookmarkMongoEntity> collection;

    public BookmarkCollection(MongoClient client, IConfiguration configuration)
    {
      var database = client.GetDatabase(configuration["Database"]);
      collection = database.GetCollection<BookmarkMongoEntity>("Bookmarks");
    }

    public IList<BookmarkMongoEntity> GetBookmarks(int index, int size)
    {
      return collection
          .Find(Builders<BookmarkMongoEntity>.Filter.Empty)
          .Skip(index * size)
          .Limit(size)
          .ToList();
    }
  }
}
