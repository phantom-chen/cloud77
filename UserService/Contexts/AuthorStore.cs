using MongoDB.Driver;
using System.Collections.Generic;
using System;
using Cloud77.Service.Entity;
using UserService.Models;
using MongoDB.Bson;
using Microsoft.Extensions.Configuration;
using Cloud77.Service;

namespace UserService.Contexts
{
    public interface IAuthorStoreContext
    {
        public IList<AuthorMongoEntity> GetAuthors(int index, int size);
        public string NewAuthor(AuthorEntity entity);
        public bool UpdateAuthor(string id, AuthorEntity entity);
        public bool DeleteAuthor(string id);
        public bool DeleteAll();
        public int CountAuthors();
    }

    public class AuthorStoreMongoContext : IAuthorStoreContext
    {
        private readonly IMongoDatabase database;

        public AuthorStoreMongoContext(IMongoDatabase database)
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

        public string NewAuthor(AuthorEntity entity)
        {
            var collection = GetCollection();
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

            return database.GetCollection<AuthorMongoEntity>(Cloud77Utility.Authors).UpdateOne(filter, update).IsAcknowledged;
        }

        public bool DeleteAuthor(string id)
        {
            var filter = Builders<AuthorMongoEntity>.Filter.Eq("_id", new ObjectId(id));
            return database.GetCollection<AuthorMongoEntity>(Cloud77Utility.Authors).DeleteOne(filter).IsAcknowledged;
        }

        public int CountAuthors()
        {
            var collection = GetCollection();
            var count = collection.CountDocuments(Builders<AuthorMongoEntity>.Filter.Empty);
            return Convert.ToInt32(count);
        }

        public bool DeleteAll()
        {
            database.DropCollection(Cloud77Utility.Authors);
            return true;
        }
    }

}
