using System.Text.Json.Serialization;

namespace GatewayService.Models
{
    public class ServiceResponse
    {
        [JsonIgnore]
        public string Code { get; set; } = "";
        
        public string Message { get; set; } = "";

        [JsonIgnore]
        public string Id { get; set; } = "";
    }
}
