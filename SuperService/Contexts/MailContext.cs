using System.Net.Mail;
using System.Net;
using System.Linq;
using Cloud77.Service.Entity;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace SuperService.Contexts
{
    public class MailContext
    {
        private readonly string host;
        private readonly string username;
        private readonly string password;
        private readonly string address;
        private readonly string display;

        public MailContext(IEnumerable<SettingMongoEntity> settings)
        {
            this.host = settings.FirstOrDefault(s => s.Key == "smtp_client_host").Value ?? "";
            this.username = settings.FirstOrDefault(s => s.Key == "smtp_client_username").Value ?? "";
            this.password = settings.FirstOrDefault(s => s.Key == "smtp_client_password").Value ?? "";
            this.address = settings.FirstOrDefault(s => s.Key == "email_address").Value ?? "";
            this.display = settings.FirstOrDefault(s => s.Key == "email_display_name").Value ?? "";
        }

        public void Send(EmailContentEntity email)
        {
            if (string.IsNullOrEmpty(password))
            {
                // save local file
            }
            else
            {
                using (SmtpClient client2 = new SmtpClient(host ?? "", 80))
                {
                    client2.EnableSsl = true;
                    NetworkCredential credential = new NetworkCredential(
                        username ?? "",
                        password ?? "");
                    client2.Credentials = credential;

                    MailMessage message2 = new MailMessage();
                    message2.From = new MailAddress(
                        address ?? "",
                        display ?? "");
                    message2.Subject = email.Subject;
                    message2.Body = email.Body;
                    message2.IsBodyHtml = email.IsBodyHtml;
                    message2.To.Add(email.Addresses.First());
                    client2.Send(message2);
                }
            }

        }
    }

}
