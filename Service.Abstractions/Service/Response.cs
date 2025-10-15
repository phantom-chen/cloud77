namespace Cloud77.Abstractions.Service
{
    public abstract class ServiceResponse
    {
        public ServiceResponse() { }

        public ServiceResponse(string code, string id, string message)
        {
            Code = code;
            Message = message;
            Id = id;
        }

        /// <summary>
        /// Response code.
        /// </summary>
        public string Code { get; set; } = "";

        /// <summary>
        /// Response message.
        /// </summary>
        public string Message { get; set; } = "";

        /// <summary>
        /// Object id.
        /// </summary>
        public string Id { get; set; } = "";
    }

    public class InternalError : ServiceResponse
    {
        public InternalError(string message)
        {
            Code = "internal-server-error";
            Message = message;
        }
    }

    public class NotFoundDatabase : ServiceResponse
    {
        public NotFoundDatabase() : base("database-not-found", "", "database not found") { }
    }

    public class DatabaseError : ServiceResponse
    {
        public DatabaseError(string message) : base("update-database-error", "", message) { }
    }

    public class EmptyDatabaseCollections : ServiceResponse
    {
        public EmptyDatabaseCollections(string database)
        {
            Code = "empty-database-collections";
            Message = $"find no collections found for database {database}";
        }
    }

    public class DatabaseDeleted : ServiceResponse
    {
        public DatabaseDeleted(string name)
        {
            Code = "database-deleted";
            Message = $"Database {name} is deleted successfully";
        }
    }

    public class SettingCreated : ServiceResponse
    {
        public SettingCreated(string id) : base("setting-created", id, "setting created") { }
    }

    public class ProductResponse : ServiceResponse
    {
        public ProductResponse(string code, string id, string message)
        {
            Code = code;
            Message = message;
            Id = id;
        }
    }

    public class LiveChartDataResponse : ServiceResponse
    {
        public LiveChartDataResponse(string message)
        {
            Code = "live-chart-data-updated";
            Message = message;
        }
    }

    public class MessageBroadcasted : ServiceResponse
    {
        public MessageBroadcasted()
        {
            Code = "broadcast-message";
            Message = "The message you send is broadcasted to all";
        }
    }

    public class CacheResponse : ServiceResponse
    {
        public CacheResponse(string code, string id, string message)
        {
            Code = code;
            Message = message;
            Id = id;
        }
    }

    public class MailSent : ServiceResponse
    {
        public MailSent(string address)
        {
            Code = "mail-sent";
            Message = $"The mail to {address} is sent successfully";
        }
    }

    public class GreetingSent : ServiceResponse
    {
        public GreetingSent(string sender)
        {
            Code = "greeting-sent";
            Message = $"The greeting message from {sender} is sent successfully";
        }
    }
}
