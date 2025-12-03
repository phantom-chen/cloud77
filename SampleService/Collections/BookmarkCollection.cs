using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using MongoDB.Bson;
using MongoDB.Driver;

namespace SampleService.Collections
{
  public class BookmarkMongoEntity : BookmarkEntity
  {
    public ObjectId Id { get; set; }
  }

  public class BookmarkCollection
  {
    private readonly IMongoCollection<BookmarkMongoEntity> collection;

    public BookmarkCollection(MongoClient client, string name)
    {
      var database = client.GetDatabase(name);
      collection = database.GetCollection<BookmarkMongoEntity>("Bookmarks");
    }

    public IList<Bookmark> GetBookmarks(int index, int size)
    {
      return collection
          .Find(Builders<BookmarkMongoEntity>.Filter.Empty)
          .Skip(index * size)
          .Limit(size)
          .ToList()
          .Select(b =>
          {
            return new Bookmark()
            {
              Id = b.Id.ToString(),
              Title = b.Title,
              Href = b.Href,
              Tags = b.Tags,
              Collection = b.Collection
            };
          }).ToList();
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
