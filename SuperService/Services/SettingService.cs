using Cloud77.Abstractions.Entity;
using Google.Protobuf.Collections;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using MongoDB.Driver;
using SuperService.Collections;
using SuperService.Protos;

namespace SuperService.Services
{
  public class SettingService : Protos.SettingService.SettingServiceBase
    {
        private readonly SettingCollection collection;
        public SettingService(MongoClient client, IConfiguration configuration)
        {
            collection = new SettingCollection(client, configuration);
        }

        public override Task<ServiceReply> CreateSetting(ServiceSetting request, ServerCallContext context)
        {
            // check if key has space
            if (request.Key.Contains(" "))
            {
                throw new RpcException(new Status());
            }

            // check if key exists
            var id = collection.Create(new SettingEntity()
            {
                Key = request.Key,
                Value = request.Value,
                Description = request.Description,
            });

            return Task.FromResult(new ServiceReply()
            {
                Code = "",
                Message = "setting is created",
                Id = id
            });
        }

        public override Task<ServiceReply> UpdateSetting(ServiceSetting request, ServerCallContext context)
        {
            return base.UpdateSetting(request, context);
        }

        public override Task<ServiceReply> DeleteSetting(ServiceSetting request, ServerCallContext context)
        {
            return base.DeleteSetting(request, context);
        }

        public override Task<ServiceSettings> GetSettings(Empty request, ServerCallContext context)
        {
            var settings = collection.Get();
            if (settings == null || settings.Count() == 0)
            {
                throw new RpcException(new Status());
            }

            var results = new RepeatedField<ServiceSetting>();
            results.AddRange(settings.Select(s => new ServiceSetting()
            {
                Key = s.Key,
                Value = s.Value,
                Description = s.Description,
            }));
            var result = new ServiceSettings();
            result.Settings.AddRange(results);
            return Task.FromResult(result);
        }
    }
}
