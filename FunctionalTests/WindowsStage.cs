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

namespace FunctionalTests
{
    [TestClass()]
    [TestCategory("windows")]
    public class WindowsStage
    {
        public WindowsStage()
        {
            string programDataPath = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
            var root = Path.Combine(programDataPath, "MyServices");

            var data = new ServiceDataModel();
            ServiceDataModel.ServiceName = "User";
            ServiceDataModel.Platform = "Windows";
            ServiceDataModel.Root = root;
            ServiceDataModel.LogFileExtension = "txt";
            ServiceDataModel.Initialize();

            var content = ServiceDataModel.GetContent("settings.json");
            if (!string.IsNullOrEmpty(content))
            {
                ServiceDataModel.Settings = JsonConvert.DeserializeObject<List<SettingEntity>>(content);
            }
        }

        string predefinedUserFolder
        {
            get
            {
                string root = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
                    "MyServer", "users");

                if (!Directory.Exists(root))
                {
                    Directory.CreateDirectory(root);
                }

                return root;
            }
        }

        [TestMethod()]
        public void SystemDataIsCorrect()
        {
            Assert.IsTrue(Directory.Exists(predefinedUserFolder));
            Assert.IsTrue(Directory.Exists(ServiceDataModel.Root));
            Assert.IsNotNull(ServiceDataModel.Settings);
            Assert.IsNotEmpty(ServiceDataModel.Settings);

            Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "event_names"));
            Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "user_roles"));

            Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "health_check_enable"));
            Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "health_check_address"));
            Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "health_check_subject"));
            Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "health_check_body"));
            Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "health_check_hour_utc"));

            Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "user_resource_servers"));

            Console.WriteLine(string.Join("\n", ServiceDataModel.GetUpStreamPaths()));
        }

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

        [TestMethod()]
        public void Debug()
        {

        }
    }
}
