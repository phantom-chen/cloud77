using Cloud77.Service.Entity;
using Microsoft.Extensions.Configuration;
using ServiceStack.Redis;
using UserService.Models;
using System;
using System.Collections.Generic;

namespace UserService.Contexts
{
    public class CacheContext
    {
        public CacheContext(IConfiguration configuration)
        {
            client = new RedisClient(
                    Environment.GetEnvironmentVariable("REDIS_HOST") ?? "localhost",
                    6379,
                    Environment.GetEnvironmentVariable("REDIS_PASSWORD") ?? "123456");
        }

        private RedisClient client;

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
