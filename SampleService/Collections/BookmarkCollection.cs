using Cloud77.Service;
using MongoDB.Bson;
using MongoDB.Driver;

namespace SampleService.Collections
{
  public class BookmarkEntity
  {
    public string Title { get; set; }
    public string Href { get; set; }
    public string Tags { get; set; }
    public string Collection { get; set; }
  }
  public class BookmarkMongoEntity : BookmarkEntity
  {
    public ObjectId Id { get; set; }
  }

  public class BookmarksResult : QueryResults
  {
    public BookmarkMongoEntity[] Data = Array.Empty<BookmarkMongoEntity>();
  }

  public class BookmarkCollection
  {
    private readonly IMongoCollection<BookmarkMongoEntity> collection;

    public BookmarkCollection(MongoClient client, string name)
    {
      var database = client.GetDatabase(name);
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

    public string CreateBookmark(BookmarkEntity entity)
    {
      var document = new BookmarkMongoEntity()
      {
        Title = entity.Title,
        Href = entity.Href,
        Tags = entity.Tags,
        Collection = entity.Collection,
      };
      collection.InsertOne(document);
      return document.Id.ToString();
    }

    public bool UpdateBookmark(string id, BookmarkEntity entity)
    {
      var filter = Builders<BookmarkMongoEntity>.Filter.Eq("_id", new ObjectId(id));
      var update = Builders<BookmarkMongoEntity>.Update
        .Set("Title", entity.Title)
        .Set("Href", entity.Href)
        .Set("Tags", entity.Tags)
        .Set("Collection", entity.Collection);

      return collection.UpdateOne(filter, update).IsAcknowledged;
    }

    public bool DeleteBookmark(string id)
    {
      var filter = Builders<BookmarkMongoEntity>.Filter.Eq("_id", new ObjectId(id));
      return collection.DeleteOne(filter).IsAcknowledged;
    }

    public int Count()
    {
      var count = collection.CountDocuments(Builders<BookmarkMongoEntity>.Filter.Empty);
      return Convert.ToInt32(count);
    }
  }
}
