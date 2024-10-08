using MongoDB.Driver;
using System;
using System.Collections.Generic;
using Cloud77.Service;
using Cloud77.Service.Entity;
using UserService.Models;
using MongoDB.Bson;

namespace UserService.Contexts
{
    public interface ITaskStoreContext
    {
        public IList<TaskMongoEntity> GetTasks(int index, int size);
        public string NewTask(string email, string title, string description);
        public bool UpdateTask(string id, string title, string description, int completed);
        public bool DeleteTask(string id);
        public int CountTasks();
    }

    public class TaskStoreMongoContext : ITaskStoreContext
    {
        private IMongoDatabase database;

        public TaskStoreMongoContext(IMongoDatabase database)
        {
            this.database = database;
        }

        private IMongoCollection<TaskMongoEntity> GetCollection()
        {
            return database.GetCollection<TaskMongoEntity>(Cloud77Utility.Tasks);
        }

        public IList<TaskMongoEntity> GetTasks(int index, int size)
        {
            return GetCollection()
                .Find(Builders<TaskMongoEntity>.Filter.Empty)
                .Skip(index * size)
                .Limit(size)
                .ToList();
        }

        public string NewTask(string email, string title, string description)
        {
            var collection = GetCollection();
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
            return database.GetCollection<TaskMongoEntity>(Cloud77Utility.Tasks).UpdateOne(filter, update).IsAcknowledged;
        }

        public bool DeleteTask(string id)
        {
            var collection = GetCollection();
            return collection.DeleteOne(Builders<TaskMongoEntity>.Filter.Eq("_id", new ObjectId(id))).IsAcknowledged;
        }

        public int CountTasks()
        {
            var collection = GetCollection();
            var count = collection.CountDocuments(Builders<TaskMongoEntity>.Filter.Empty);
            return Convert.ToInt32(count);
        }
    }
}
