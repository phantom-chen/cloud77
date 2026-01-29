using Cloud77.Abstractions;
using ServiceStack.Redis;
using SuperService.Models;

namespace SuperService.Collections
{
    public class CacheCollection
    {
        private readonly RedisClient client;

        public CacheCollection()
        {
            client = new RedisClient(ServiceDataModel.GetVariable("REDIS_HOST"), 6379, ServiceDataModel.GetVariable("REDIS_PASSWORD"));
        }

        public bool Ping()
        {
            return client.Ping();
        }

        public T GetValue<T>(string key)
        {
            return client.Get<T>(key);
        }

        public bool RemoveValue(string key)
        {
            return client.Remove(key);
        }

        public bool SetValue<T>(string key, T value, TimeSpan timeSpan)
        {
            if (value == null) return false;
            if (timeSpan != TimeSpan.Zero)
            {
                return client.Set<T>(key, value, TimeSpan.FromHours(1));
            }
            else
            {
                return client.Set<T>(key, value);
            }
        }

        public List<string> GetList(string list)
        {
            return client.GetAllItemsFromList(list);
        }

        public void AddToList(string list, string value)
        {
            client.AddItemToList(list, value);
        }

        public long RemoveFromList(string list, string value)
        {
            return client.RemoveItemFromList(list, value);
        }

        public void ClearList(string list)
        {
            client.RemoveAllFromList(list);
        }
    }
}
