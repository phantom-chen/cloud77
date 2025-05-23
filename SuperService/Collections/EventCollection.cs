﻿using Cloud77.Service;
using Cloud77.Service.Entity;
using MongoDB.Bson;
using MongoDB.Driver;

namespace SuperService.Collections
{
  public class EventMongoEntity : EventEntity
  {
    public ObjectId Id { get; set; }
  }

  public class EventCollection
  {
    private readonly IMongoCollection<EventMongoEntity> collection;

    public EventCollection(IMongoDatabase database)
    {
      collection = database.GetCollection<EventMongoEntity>(Cloud77Utility.Events);
    }

    public EventCollection(MongoClient client, IConfiguration configuration)
    {
      var database = client.GetDatabase(configuration["Database"]);
      collection = database.GetCollection<EventMongoEntity>(Cloud77Utility.Events);
    }

    public string AppendEventLog(EventEntity entity)
    {
      var document = new EventMongoEntity()
      {
        Name = entity.Name,
        UserEmail = entity.Email,
        Email = entity.Email,
        Payload = entity.Payload,
        Date = DateTime.UtcNow
      };
      collection.InsertOne(document);
      return document.Id.ToString();
    }

    public IEnumerable<EventEntity> GetEventLogs(string name, int index, int size)
    {
      return collection
        .Find(Builders<EventMongoEntity>.Filter.Eq("Name", name))
        .Sort(Builders<EventMongoEntity>.Sort.Descending("_id"))
        .Skip(index * size)
        .Limit(size)
        .ToList();
    }

    public IEnumerable<EventEntity> GetEventLogs(string email)
    {
      // TODO event logs related to user self
      //var filter = Builders<EventMongoEntity>.Filter.And(
      //    Builders<EventMongoEntity>.Filter.Eq("Email", email),
      //    Builders<EventMongoEntity>.Filter.Or(
      //        Builders<EventMongoEntity>.Filter.Eq("Name", "Issue-Email-Token"),
      //        Builders<EventMongoEntity>.Filter.Eq("Name", "Verify-Email"),
      //        Builders<EventMongoEntity>.Filter.Eq("Name", "Reset-Password")));
      var filter = Builders<EventMongoEntity>.Filter.Eq("Email", email);
      return collection
        .Find(filter)
        .Sort(Builders<EventMongoEntity>.Sort.Descending("_id"))
        .ToList();
    }
  }
}
