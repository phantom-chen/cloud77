using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using YamlDotNet.Serialization.NamingConventions;
using YamlDotNet.Serialization;
using YamlDotNet.Core;

namespace Cooler.Client.Providers
{
    public class PersonProvider : IPersonProvider
    {
        public PersonProvider(IUserDataProvider userData)
        {
            this.userData = userData;
        }

        public Person GetPerson()
        {
            var content = this.userData.GetContent("person.yaml");
            var person = deserializer.Deserialize<Person>(content);
            return person;
        }

        public void UpdatePerson(Person person)
        {
            var content = serializer.Serialize(person);
            this.userData.WriteContent("person.yaml", content);
        }

        private ISerializer serializer = new SerializerBuilder().WithNamingConvention(CamelCaseNamingConvention.Instance).Build();
        private IDeserializer deserializer = new DeserializerBuilder().WithNamingConvention(CamelCaseNamingConvention.Instance).Build();
        private readonly IUserDataProvider userData;
    }
}
