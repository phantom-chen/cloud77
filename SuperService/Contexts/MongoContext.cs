using Cloud77.Service;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Drawing;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace SuperService.Contexts
{
    public class UserMongoContext
    {
        private IMongoDatabase database;

        public UserMongoContext(IMongoDatabase database)
        {
            this.database = database;
        }

        private IMongoCollection<UserMongoEntity> GetCollection()
        {
            return database.GetCollection<UserMongoEntity>(Cloud77Utility.Users);
        }

        public UserMongoEntity GetUser(string email)
        {
            return GetCollection().Find(Builders<UserMongoEntity>.Filter.Eq("Email", email)).FirstOrDefault();
        }

        public IList<UserMongoEntity> GetUsers(int index, int size, string sort)
        {
            if (sort == "asc")
            {
                return GetCollection()
                    .Find(Builders<UserMongoEntity>.Filter.Empty)
                    .Sort(Builders<UserMongoEntity>.Sort.Ascending("_id"))
                    .Skip(index * size)
                    .Limit(size)
                    .ToList();
            }
            else
            {
                return GetCollection()
                    .Find(Builders<UserMongoEntity>.Filter.Empty)
                    .Sort(Builders<UserMongoEntity>.Sort.Descending("_id"))
                    .Skip(index * size)
                    .Limit(size)
                    .ToList();
            }
        }

        public string NewEmailToken(string email, int usage)
        {
            var stamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            //var document = new EmailTokenMongoEntity()
            //{
            //    Name = name,
            //    Title = title,
            //    Region = region,
            //    Address = address,
            //    CreatedAt = stamp,
            //    Timestamp = stamp
            //};
            //GetCollection().InsertOne(document);
            //return document.Id.ToString();
            return "";
        }
    }

    public class EventStoreMongoContext
    {
        private IMongoDatabase database;

        public EventStoreMongoContext(IMongoDatabase database)
        {
            this.database = database;
        }

        private IMongoCollection<EventMongoEntity> GetCollection()
        {
            return database.GetCollection<EventMongoEntity>(Cloud77Utility.Events);
        }

        public IList<EventMongoEntity> GetEvents(int index, int size)
        {
            return GetCollection()
                .Find(Builders<EventMongoEntity>.Filter.Empty)
                .Skip(index * size)
                .Limit(size)
                .ToList();
        }
    }

    public class AuthorContext
    {
        private IMongoDatabase database;

        public AuthorContext(IMongoDatabase database)
        {
            this.database = database;
        }

        private IMongoCollection<AuthorMongoEntity> GetCollection()
        {
            return database.GetCollection<AuthorMongoEntity>(Cloud77Utility.Authors);
        }

        public IList<AuthorMongoEntity> GetAuthors(int index, int size)
        {
            return GetCollection()
                .Find(Builders<AuthorMongoEntity>.Filter.Empty)
                .Skip(index * size)
                .Limit(size)
                .ToList();
        }

        public string NewAuthor(string name, string title, string region, string address)
        {
            var datetime = DateTime.UtcNow;
            var stamp = datetime.ToString("yyyyMMddHHmmss");
            var document = new AuthorMongoEntity()
            {
                Name = name,
                Title = title,
                Region = region,
                Address = address,
                CreatedAt = datetime,
                UpdatedAt = datetime
            };
            GetCollection().InsertOne(document);
            return document.Id.ToString();
        }

        public bool UpdateAuthor(string id, string name, string title, string country, string address)
        {
            var filter = Builders<AuthorMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            var datetime = DateTime.UtcNow;
            var update = Builders<AuthorMongoEntity>.Update
                .Set("Name", name)
                .Set("Title", title)
                .Set("Region", country)
                .Set("Address", address)
                .Set("UpdatedAt", datetime);
            return GetCollection().UpdateOne(filter, update).IsAcknowledged;
        }

        public bool DeleteAuthor(string id)
        {
            var filter = Builders<AuthorMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            return GetCollection().DeleteOne(filter).IsAcknowledged;
        }

        public int CountAuthors()
        {
            var count = GetCollection().CountDocuments(Builders<AuthorMongoEntity>.Filter.Empty);
            return Convert.ToInt32(count);
        }

        public bool DeleteAll()
        {
            database.DropCollection(Cloud77Utility.Authors);
            return true;
        }
    }

    public class TaskContext
    {
        private readonly IMongoDatabase database;

        public TaskContext(IMongoDatabase database)
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
            var document = new TaskMongoEntity()
            {
                Email = email,
                Title = title,
                Description = description,
                State = 0
            };
            GetCollection().InsertOne(document);
            return document.Id.ToString();
        }

        public bool UpdateTask(string id, string title, int completed)
        {
            var filter = Builders<TaskMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            var update = Builders<TaskMongoEntity>.Update
                .Set("Title", title)
                .Set("State", completed);
            return GetCollection().UpdateOne(filter, update).IsAcknowledged;
        }

        public bool DeleteTask(string id)
        {
            return GetCollection().DeleteOne(Builders<TaskMongoEntity>.Filter.Eq("_id", new ObjectId(id))).IsAcknowledged;
        }

        public int CountTasks()
        {
            var count = GetCollection().CountDocuments(Builders<TaskMongoEntity>.Filter.Empty);
            return Convert.ToInt32(count);
        }
    }
}
