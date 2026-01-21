using Cloud77.Abstractions;
using Cloud77.Abstractions.Entity;
using System.Net;
using System.Net.Mail;

namespace SuperService.Models
{
    public class MailClient : IDisposable
    {
        private readonly string host;
        private readonly string username;
        private readonly string password;
        private readonly string address;
        private readonly string display;
        private readonly TextLoggingModel textLogging = new TextLoggingModel();

        public MailClient()
        {
            host = ServiceDataModel.GetSetting("smtp_client_host");
            username = ServiceDataModel.GetSetting("smtp_client_username");
            password = ServiceDataModel.GetSetting("smtp_client_password");
            address = ServiceDataModel.GetSetting("email_address");
            display = ServiceDataModel.GetSetting("email_display_name");
        }

        public void Dispose()
        {
            textLogging.Commit();
        }

        public void Send(EmailEntity email)
        {
            var date = DateTime.Now;
            var count = email.Addresses.Count();
            if (count == 0)
            {
                textLogging.PushLog("Mail Client: find no email address", true, date);
                return;
            }
            if (count != 1)
            {
                textLogging.PushLog("Mail Client: only support sending to one address at a time", true, date);
                return;
            }
            if (string.IsNullOrEmpty(email.Subject))
            {
                textLogging.PushLog("Mail Client: email subject is empty", true, date);
                return;
            }
            if (string.IsNullOrEmpty(email.Body))
            {
                textLogging.PushLog("Mail Client: email body is empty", true, date);
                return;
            }
            textLogging.PushLog($"Mail Client: save the mail body locally");
            ServiceDataModel.SaveLatestMailBody(email.Body);

            if (string.IsNullOrEmpty(password)
                || string.IsNullOrEmpty(host)
                || string.IsNullOrEmpty(username)
                || string.IsNullOrEmpty(address)
                || string.IsNullOrEmpty(display))
            {
                textLogging.PushLog("Mail Client: skip sending email due to empty setting", true, date);
                return;
            }

            if (email.Addresses.First().ToLower().EndsWith("@example.com"))
            {
                textLogging.PushLog("Mail Client: skip sending email to example.com address", true, date);
                return;
            }

            textLogging.PushLog($"Mail Client: sending email to {email.Addresses.First()}", false, date);
            using (SmtpClient client = new SmtpClient(host ?? "", 80))
            {
                client.EnableSsl = true;
                NetworkCredential credential = new NetworkCredential(
                    username ?? "",
                    password ?? "");
                client.Credentials = credential;

                MailMessage message2 = new MailMessage();
                message2.From = new MailAddress(
                    address ?? "",
                    display ?? "");
                message2.Subject = email.Subject;
                message2.Body = email.Body;
                message2.IsBodyHtml = email.IsBodyHtml;
                message2.To.Add(email.Addresses.First());
                client.Send(message2);
            }
        }
    }
}
