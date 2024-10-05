using Cooler.Client;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Cooler.ClientTests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            var h = new Hello();
            Assert.IsNotNull(h.Greeting());
        }
    }
}
