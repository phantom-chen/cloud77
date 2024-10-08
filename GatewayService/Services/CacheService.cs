using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace GatewayService.Services
{
    public class ServiceResponse
    {
        public ServiceResponse() { }
        public ServiceResponse(string code, string id, string message)
        {
            Code = code;
            Message = message;
            Id = id;
        }

        public string Code { get; set; } = "";
        public string Message { get; set; } = "";
        public string Id { get; set; } = "";
    }
    //public class CacheService
    //{
    //    public CacheService(IConfiguration configuration)
    //    {
    //        client = new RedisClient(
    //            configuration["Redis_host"],
    //            6379,
    //            configuration["Redis_password"]);
    //    }

    //    private RedisClient client;

    //    public T GetValue<T>(string key)
    //    {
    //        return client.Get<T>(key);
    //    }

    //    public bool RemoveValue(string key)
    //    {
    //        return client.Remove(key);
    //    }

    //    public bool SetValue<T>(string key, T value, TimeSpan timeSpan)
    //    {
    //        if (value == null) return false;
    //        if (timeSpan != TimeSpan.Zero)
    //        {
    //            return client.Set<T>(key, value, TimeSpan.FromHours(1));
    //        }
    //        else
    //        {
    //            return client.Set<T>(key, value);
    //        }
    //    }
    //}
}
