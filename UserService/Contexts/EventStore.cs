using Cloud77.Service;
using Cloud77.Service.Entity;
using MongoDB.Driver;
using UserService.Models;
using System;
using System.Collections.Generic;

namespace UserService.Contexts
{
    public interface IEventStoreContext
    {
        public IList<EventMongoEntity> GetEventsByEmail(string email, int index, int size);
        public IList<EventMongoEntity> GetEventsByName(string name, int index, int size);
        public IList<EventMongoEntity> GetEventsByUser(string user, int index, int size);
        public string NewEvent(EventEntity entity);
    }

    public class EventStoreMongoContext : IEventStoreContext
    {
        private readonly IMongoCollection<EventMongoEntity> collection;

        public EventStoreMongoContext(IMongoDatabase database)
        {
            collection = database.GetCollection<EventMongoEntity>(Cloud77Utility.Events);
        }

        public IList<EventMongoEntity> GetEventsByEmail(string email, int index, int size)
        {
            return collection
                .Find(Builders<EventMongoEntity>.Filter.Eq("Email", email))
                .Skip(index * size)
                .Limit(size)
                .ToList();
        }

        public IList<EventMongoEntity> GetEventsByName(string name, int index, int size)
        {
            return collection
                .Find(Builders<EventMongoEntity>.Filter.Eq("Name", name))
                .Skip(index * size)
                .Limit(size)
                .ToList();
        }

        public IList<EventMongoEntity> GetEventsByUser(string user, int index, int size)
        {
            return collection
                .Find(Builders<EventMongoEntity>.Filter.Eq("UesrEmail", user))
                .Skip(index * size)
                .Limit(size)
                .ToList();
        }

        public string NewEvent(EventEntity entity)
        {
            var document = new EventMongoEntity()
            {
                Name = entity.Name,
                UserEmail = entity.UserEmail,
                Email = entity.Email,
                Payload = entity.Payload,
                Date = DateTime.UtcNow
            };
            collection.InsertOne(document);
            return document.Id.ToString();
        }
    }
}
