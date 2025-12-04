using System;
using System.Diagnostics;
using System.Text;

namespace FunctionalTests
{
    [TestClass]
    public sealed class Test1
    {
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
