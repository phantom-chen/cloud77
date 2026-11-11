using Cloud77.Abstractions;
using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using Cloud77.Abstractions.Utility;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FunctionalTests.WindowsTests
{
  [TestClass()]
  [TestCategory("windows")]
  public class WindowsStage111
  {
    [TestMethod()]
    public void UserTokenTests()
    {
      var model = new UserDataModel("unit_test_user@example.com");
      var date = DateTime.UtcNow;
      var timestamp = date.ToString("yyyyMMddHHmmss");
      var expiration = date.AddMinutes(30).ToString("yyyyMMddHHmmss");
      var salt = new TokenSalt() { Value = CodeGenerator.GenerateCode(16), Expiration = expiration };

      model.SaveAccessTokenHistory(timestamp, salt);
      model.SaveRefreshTokenHistory(timestamp, LoginMethod.Password, salt);

      var expired = model.RefreshTokenSaltIsExpired(new TokenSalt()
      {
        Value = "",
        Expiration = date.AddMinutes(-10).ToString("yyyyMMddHHmmss")
      });

      Assert.IsTrue(expired);

      expired = model.RefreshTokenSaltIsExpired(new TokenSalt()
      {
        Value = "",
        Expiration = date.AddMinutes(10).ToString("yyyyMMddHHmmss")
      });

      Assert.IsFalse(expired);

      model.SaveLogoutHistory(timestamp, salt, salt);

      model.Remove();
    }

    [TestMethod()]
    public void LockUserTest()
    {
      var model = new UserDataModel("unit_test_user@example.com");
      model.Remove();

      var date = DateTime.UtcNow;

      Assert.IsFalse(model.UserIsLocked());

      // input wrong password too many times
      var lockEvent = new LockUserEvent()
      {
        Manager = "admin@example.com",
        Reason = "Too many failed login attempts",
        Timestamp = date.ToString("yyyyMMddHHmmss"),
        Expiration = date.AddHours(1).ToString("yyyyMMddHHmmss")
      };
      model.LockUser(JsonConvert.SerializeObject(lockEvent));

      Assert.IsTrue(model.UserIsLocked());

      model.UnlockUser();

      Assert.IsFalse(model.UserIsLocked());

      model.Remove();
    }
  }
}
