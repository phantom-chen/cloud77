using Cloud77.Service.Entity;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace UserService.Models
{
    public class SettingMongoEntity : SettingEntity
    {
        public ObjectId Id { get; set; }
    }

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
}
