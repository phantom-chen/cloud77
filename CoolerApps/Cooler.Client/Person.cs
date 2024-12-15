using System;
using System.Collections.Generic;
using System.Text;

namespace Cooler.Client
{
    public class Contact
    {
        public string Email { get; set; }
        public string Phone { get; set; }
        //[JsonProperty("github")]
        public string Github { get; set; }
    }

    public class Address
    {
        public string Office { get; set; }
        public string Home { get; set; }
    }

    public class Person
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public double Scores { get; set; }
        public Contact Contact { get; set; }
        public Address Address { get; set; }
        public string[] Tags { get; set; }
    }

    public interface IPersonProvider
    {
        Person GetPerson();
        void UpdatePerson(Person person);
    }
}
