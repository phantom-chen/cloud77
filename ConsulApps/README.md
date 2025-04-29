# Consul Apps

Ocelot.Provider.Consul

builder.AddJsonFile(File.Exists("ocelot.consul.json") ? "ocelot.consul.json" : "ocelot.json");

services.AddSingleton<IConsulClient, ConsulClient>(p =>
{
    return new ConsulClient(config =>
    {
        config.Address = new Uri(Configuration["Consul_address"]);
    });
});

services.AddOcelot(Configuration).AddConsul();  // use consul

"Consul_address": "http://consulhost:8500",