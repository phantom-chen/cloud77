using Cloud77.Service;
using Cloud77.Service.Entity;
using System.Collections.Generic;
using MongoDB.Driver;
using UserService.Models;
using System;
using System.Linq;
using Newtonsoft.Json;
using System.IO;
using System.Reflection;
using SharpCompress.Common;

namespace UserService.Contexts
{
    public interface IUserServiceManager
    {
        IUserDatabase Database { get; }
        string NewUser(string email, string username, string password, string role);
        //bool ResetPassword(string email, string password);
        UserEntity GetUser(string email, string name);
        //IEnumerable<EventEntity> GetEvents(string email);
        //IList<UserEntity> GetUsers(string role, int index, int size, string sort);
        bool UpdateName(string email, string name);
        bool UpdatePassword(string email, string password);
        bool NewProfile(string email, ProfileEntity entity);
        bool DeleteProfile(string email);
        
    }

    //public interface IUserStoreContext
    //{
    //    public bool DeleteAccount(string email);
    //    List<EventMongoEntity> GetEvents(string email);
    //    string NewEvent(EventEntity entity);
    //}

    public class UserDatabase : IUserDatabase
    {
        private readonly IMongoCollection<UserMongoEntity> collection;
        private readonly IMongoCollection<EventMongoEntity> collection2;

        public UserDatabase(IMongoDatabase database)
        {
            collection = database.GetCollection<UserMongoEntity>(Cloud77Utility.Users);
            collection2 = database.GetCollection<EventMongoEntity>(Cloud77Utility.Events);
        }

        public IEnumerable<UserEntity> GetUsers(int index, int size, string sort)
        {
            List<UserMongoEntity> entities;
            if (sort == "asc")
            {
                entities = collection
                    .Find(Builders<UserMongoEntity>.Filter.Empty)   // Builders<BsonDocument>.Filter.Lt("id", 10) & Builders<BsonDocument>.Filter.Gte("id", 2)
                    .Sort(Builders<UserMongoEntity>.Sort.Ascending("_id"))
                    .Skip(index * size)
                    .Limit(size)
                    .ToList();
            }
            else
            {
                entities = collection
                    .Find(Builders<UserMongoEntity>.Filter.Empty)
                    .Sort(Builders<UserMongoEntity>.Sort.Descending("_id"))
                    .Skip(index * size)
                    .Limit(size)
                    .ToList();
            }
            return entities;
        }

        public string CreateUser(UserEntity user)
        {
            var document = new UserMongoEntity()
            {
                Email = user.Email,
                Role = user.Role,
                Name = user.Name,
                Password = user.Password,
            };
            collection.InsertOne(document);
            return document.Id.ToString();
        }

        public bool DeleteUser(string email)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
            return collection.DeleteOne(filter).IsAcknowledged;
        }

        public UserEntity GetUser(string email)
        {
            return collection.Find(Builders<UserMongoEntity>.Filter.Eq("Email", email)).FirstOrDefault();
        }

        public UserEntity GetUserByName(string name)
        {
            return collection.Find(Builders<UserMongoEntity>.Filter.Eq("Name", name)).FirstOrDefault();
        }

        public bool UpdateUser(UserEntity user)
        {
            var filter = Builders<UserMongoEntity>.Filter.Eq("Email", user.Email);
            var update = Builders<UserMongoEntity>.Update.Set("Name", user.Name).Set("Password", user.Password).Set("Role", user.Role).Set("Profile", user.Profile);
            return collection.UpdateOne(filter, update).IsAcknowledged;
        }

        public IEnumerable<EventEntity> GetEvents(string email)
        {
            var filter = Builders<EventMongoEntity>.Filter.And(
                Builders<EventMongoEntity>.Filter.Eq("Email", email),
                Builders<EventMongoEntity>.Filter.Or(
                    Builders<EventMongoEntity>.Filter.Eq("Name", "Issue-Email-Token"),
                    Builders<EventMongoEntity>.Filter.Eq("Name", "Verify-Email"),
                    Builders<EventMongoEntity>.Filter.Eq("Name", "Reset-Password")));
            return collection2.Find(filter).ToList();
        }

        public string NewEvent(EventEntity entity)
        {
            var document = new EventMongoEntity()
            {
                Name = entity.Name,
                UserEmail = entity.Email,
                Email = entity.Email,
                Payload = entity.Payload,
                Date = DateTime.UtcNow
            };
            collection2.InsertOne(document);
            return document.Id.ToString();
        }
    }

    public class UserServiceManager : IUserServiceManager
    {
        private readonly IUserDatabase database;
        public UserServiceManager(IUserDatabase database)
        {
            this.database = database;
        }

        public IUserDatabase Database => database;

        public bool DeleteProfile(string email)
        {
            var user = database.GetUser(email);
            user.Profile = null;
            return database.UpdateUser(user);
        }

        public UserEntity GetUser(string email, string name)
        {
            if (!string.IsNullOrEmpty(email))
            {
                return database.GetUser(email);
            }
            return database.GetUserByName(name);
        }

        public bool NewProfile(string email, ProfileEntity entity)
        {
            var user = database.GetUser(email);
            user.Profile = entity;
            return database.UpdateUser(user);
        }

        public string NewUser(string email, string username, string password, string role)
        {
            var user = new UserEntity()
            {
                Email = email,
                Role = role,
                Name = username,
                Password = password,
            };
            return database.CreateUser(user);
        }

        public bool UpdateName(string email, string name)
        {
            var user = database.GetUser(email);
            user.Name = name;
            return database.UpdateUser(user);
        }

        public bool UpdatePassword(string email, string password)
        {
            var user = database.GetUser(email);
            user.Password = password;
            return database.UpdateUser(user);
        }
    }
}