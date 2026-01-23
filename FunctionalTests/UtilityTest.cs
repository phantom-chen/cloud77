using Cloud77.Abstractions.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FunctionalTests
{
    [TestClass()]
    public class UtilityTest
    {
        [TestMethod()]
        public void CheckEmailFormat()
        {
            Assert.IsTrue(UserUtility.IsEmailFormat("user@example.com"));
            Assert.IsFalse(UserUtility.IsEmailFormat("userexample.com"));
            Assert.IsFalse(UserUtility.IsEmailFormat("user@user@example.com"));
        }

        [TestMethod()]
        public void CheckPasswordComplex()
        {
            Assert.IsFalse(UserUtility.PasswordIsComplex("ZXCVBNM", 6));
            Assert.IsFalse(UserUtility.PasswordIsComplex("a123456", 6));
            Assert.IsTrue(UserUtility.PasswordIsComplex("Aa123456!", 6));
        }
    }
}
