using Cloud77.Service.Entity;
using MongoDB.Bson;
using System;

namespace SuperService.Contexts
{
    public class TaskMongoEntity : TaskEntity
    {
        public ObjectId Id { get; set; }
    }

    public class AuthorMongoEntity : AuthorEntity
    {
        public ObjectId Id { get; set; }
    }

    public class UserMongoEntity : UserEntity
    {
        public ObjectId Id { get; set; }
        public string License { get; set; }
        public string Devices { get; set; }
    }

    public class EventMongoEntity : EventEntity
    {
        public ObjectId Id { get; set; }
    }

    public class SettingMongoEntity : SettingEntity
    {
        public ObjectId Id { get; set; }
    }
}
