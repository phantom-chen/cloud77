using Reqnroll;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestUtility;

namespace FunctionalTests.StepDefinitions
{
    [Binding]
    public sealed class TesterStepDefinitions
    {
        private readonly TesterModel tester;

        public TesterStepDefinitions(TesterModel tester)
        {
            this.tester = tester;
        }

        [Given(@"I am using the admininistrator account$")]
        public void UseAdministratorAccount()
        {
            string root = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
                "MyServer", "users");

            if (!Directory.Exists(root))
            {
                Directory.CreateDirectory(root);
            }
            tester.Load(root, "admin");
            Assert.IsTrue(!string.IsNullOrEmpty(tester.User.Email));
        }

        [Given(@"I am the user account")]
        public void UpdateUserAccount(Table table)
        {
            foreach (var row in table.Rows)
            {
                var key = row["Key"];
                var value = row["Value"];
                switch (key.ToLower())
                {
                    case "email":
                        tester.User.Email = value;
                        break;
                    case "password":
                        tester.User.Password = value;
                        break;
                    default:
                        throw new ArgumentException($"Unknown key: {key}");
                }
            }
        }
    }
}
