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

        [Given(@"I am the tester (.*)$")]
        public void UpdateTester(string id)
        {
            string root = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
                "MyServer", "users");

            if (!Directory.Exists(root))
            {
                Directory.CreateDirectory(root);
            }
            tester.Load(root, id);
            Assert.IsTrue(!string.IsNullOrEmpty(tester.User.Email));
        }
    }
}
