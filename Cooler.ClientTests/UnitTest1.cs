using Cooler.Client;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.IO;
using System.Reflection;

namespace Cooler.ClientTests
{
    [TestClass]
    public class UnitTest1
    {
        [AssemblyInitialize]
        public static void Initialize(TestContext context)
        {
            var Startup = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var UserData = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Cooler_test");

            var Options = new CoolerClientOptions()
            {
                Online = false,
                Version = "0.0.0",
                StartupPath = Startup,
                UserDataPath = UserData
            };
        }

        [TestMethod]
        public void TestMethod1()
        {
            var h = new Hello();
            Assert.IsNotNull(h.Greeting());
        }
    }
}
