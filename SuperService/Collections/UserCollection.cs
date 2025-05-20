using Cloud77.Service;
using Cloud77.Service.Entity;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace SuperService.Collections
{
  public class UserMongoEntity : UserEntity
  {
    public ObjectId Id { get; set; }
    public string License { get; set; }
    public string Devices { get; set; }
  }

  public class UserCollection
  {
    private readonly IMongoCollection<UserMongoEntity> collection;
    private readonly EventCollection events;

    public UserCollection(IMongoDatabase database)
    {
      collection = database.GetCollection<UserMongoEntity>(Cloud77Utility.Users);
      events = new EventCollection(database);
    }

    public UserCollection(MongoClient client, IConfiguration configuration)
    {
      var database = client.GetDatabase(configuration["Database"]);
      collection = database.GetCollection<UserMongoEntity>(Cloud77Utility.Users);
      events = new EventCollection(client, configuration);
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

      var date = DateTime.UtcNow;
      var log = new EventEntity()
      {
        Name = "Create-User",
        UserEmail = user.Email,
        Email = user.Email,
        Date = date,
      };
      events.AppendEventLog(log);

      return document.Id.ToString();
    }

    public UserEntity GetUser(string email)
    {
      return collection.Find(Builders<UserMongoEntity>.Filter.Eq("Email", email)).FirstOrDefault();
    }

    public string CreateVerificationCode(string email)
    {
      var date = DateTime.UtcNow;
      string token = CodeGenerator.HashString(email.ToLower() + date.Millisecond.ToString()); // TODO add salt or secret
      var usage = "verify-email";
      var payload = new TokenPayload()
      {
        Usage = usage,
        Token = token,
        Exp = date.AddHours(1)
      };
      events.AppendEventLog(new EventEntity()
      {
        Name = "Issue-Email-Token",
        UserEmail = email,
        Email = email,
        Payload = JsonConvert.SerializeObject(payload),
        Date = date,
      });
      return token;
    }

    public bool UpdateUser(string email, bool confirmed, string token)
    {
      var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
      var update = Builders<UserMongoEntity>.Update.Set("Confirmed", confirmed);
      var ack = collection.UpdateOne(filter, update).IsAcknowledged;

      if (ack)
      {
        events.AppendEventLog(new EventEntity()
        {
          Name = "Verify-Email",
          UserEmail = email,
          Email = email,
          Payload = JsonConvert.SerializeObject(new TokenPayload()
          {
            Token = token,
            Usage = "verify-email",
          }),
          Date = DateTime.UtcNow
        });
      }

      return ack;
    }

    public bool UpdateUser(string email, ProfileEntity profile)
    {
      var filter = Builders<UserMongoEntity>.Filter.Eq("Email", email);
      var update = Builders<UserMongoEntity>.Update.Set("Profile", profile);
      return collection.UpdateOne(filter, update).IsAcknowledged;
    }

    public IEnumerable<TokenPayload> GetTokenPayloads(string email)
    {
      var logs = events.GetEventLogs(email);
      var payloads = logs.Select(e => JsonConvert.DeserializeObject<TokenPayload>(e.Payload));
      return payloads;
    }

    public IEnumerable<UserEntity> GetUsers(int index, int size, string sort)
    {
      List<UserMongoEntity> entities;

      // Builders<BsonDocument>.Filter.Lt("id", 10) & Builders<BsonDocument>.Filter.Gte("id", 2)

      if (sort == "asc")
      {
        entities = collection
            .Find(Builders<UserMongoEntity>.Filter.Empty)
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
  }
}
