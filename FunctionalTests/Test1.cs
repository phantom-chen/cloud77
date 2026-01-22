using Cloud77.Abstractions;
using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using Cloud77.Abstractions.Utility;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.Globalization;
using System.Text;

namespace FunctionalTests
{
    [TestClass]
    public sealed class Test1
    {
        [TestCategory("windows")]
        [TestMethod()]
        public void LocalDataModelTests()
        {
            Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
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

            Assert.IsTrue(Directory.Exists(ServiceDataModel.Root));
            Assert.IsNotNull(ServiceDataModel.Settings);
            Assert.IsNotEmpty(ServiceDataModel.Settings);
            Console.WriteLine(ServiceDataModel.Settings.First().Key);

            Console.WriteLine(string.Join("\n", ServiceDataModel.GetUpStreamPaths()));

            var model = new UserDataModel("user1@example.com");
            var date = DateTime.UtcNow;
            var timestamp = date.ToString("yyyyMMddHHmmss");
            var expiration = date.AddDays(14).ToString("yyyyMMddHHmmss");
            var salt = new TokenSalt() { Value = CodeGenerator.GenerateCode(16), Expiration = expiration };

            model.SaveTokenHistory(timestamp, LoginMethod.Password, salt);

            var date2 = DateTime.ParseExact("", "yyyyMMddHHmmss", CultureInfo.InvariantCulture);
        }

        [TestMethod()]
        public void FindUsers()
        {
            Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
            string programDataPath = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
            var root = Path.Combine(programDataPath, "MyServices");
            var path = Path.Combine(root, "users", "index", "users.json");
            Assert.IsTrue(File.Exists(path));

            var content = File.ReadAllText(path);
            var users = JsonConvert.DeserializeObject<List<TestUtility.User>>(content);
            Assert.IsNotNull(users);
            Console.WriteLine(users.Count);
            Console.WriteLine(users.First().Email);
            var _users = users.Where(u => u.Email.Contains("example.com")).Select(u => u.Email);
            Console.WriteLine(string.Join(',', _users));
        }

        [TestMethod]
        public void TestMethod1()
        {
            string a = "123:456:789";
            string b = Convert.ToBase64String(Encoding.UTF8.GetBytes(a.ToCharArray()));
            string c = Encoding.UTF8.GetString(Convert.FromBase64String(b));
        }

        [TestMethod]
        public void MultiThreadTests()
        {
            Task task = new Task(() =>
            {
                var id = Thread.CurrentThread.ManagedThreadId;
                Debug.WriteLine(id);
            });

            task.Start();

            Thread thread = new Thread(() => {
                Debug.WriteLine("test from another thread // " + Thread.CurrentThread.Name + " // " + Thread.CurrentThread.CurrentUICulture.Name);
            });
            thread.Name = "customThread";
            thread.CurrentCulture = new System.Globalization.CultureInfo("fr-FR");
            thread.CurrentUICulture = new System.Globalization.CultureInfo("fr-FR");
            thread.IsBackground = true;
            thread.Start();

            task.Wait();
            Debug.WriteLine(task.Id);
        }
    
        private void EmailContent()
        {
            string mailSubject = "Email confirmation - Company Name";
            string mailBody = string.Format(
                "Please click below link, or copy it to your browser to continue your registration. The link will expire in 1 hour. \n"
                + "{0}/api/xxx/{1}?token={2} \n\n\n"
                + "By clicking above link, you accept: \n"
                + "a. Company Terms: {0}/company-terms.html \n"
                + "b. Company Privacy Policy: https://www.xxx.com/en/terms/privacy/ \n\n"
                + "Best regards\n Your software team",
                "xxx",
                "xxx",
                "xxx");
            var _content = "";
            _content = "The email is not ready to be confirmed. Please register in software at first.";
            _content = "This token is not existing. Please resend a confirmation email in software.";
            _content = "This token is expired. Please resend a confirmation email in software.";

            string subject = "Password Reset";
            string body = string.Format(
                "Please open link below in your browser to reset password, link is valid in {0} hour.\n " +
                "{1}\n\n" +
                "Best regards\n" +
            "Your Team",
            1, "xxx");

            var _message = "";
            _message = "The token has been expired. Please resend a password reset email in software.";
            _message = "The password has been successfully reset.";
        }
    }

    [TestClass]
    public sealed class TesterTest
    {
        [TestMethod]
        public void Test()
        {
            string root = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
                "MyServer", "users");

            if (!Directory.Exists(root))
            {
                Directory.CreateDirectory(root);
            }
        }
    }
}
