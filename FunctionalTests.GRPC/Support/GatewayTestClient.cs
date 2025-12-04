using Grpc.Net.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;
using TestUtility;

namespace FunctionalTests.GRPC.Support
{
    public class GatewayTestClient
    {
        private TesterModel tester;

        public GrpcChannel Channel { get; private set; }

        public string GRPC { get; private set; }

        public TesterModel Tester => tester;

        public GatewayTestClient(TesterModel tester)
        {
            this.tester = tester;

            GRPC = Environment.GetEnvironmentVariable("GRPCURL") ?? "https://localhost:7701";
            Channel = GrpcChannel.ForAddress(
              GRPC,
              new GrpcChannelOptions()
              {
                  HttpHandler = new HttpClientHandler { ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator }
              }
            );
        }
    }
}
