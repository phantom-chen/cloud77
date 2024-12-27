using System.Net.Mail;
using System.Net;
using Cloud77.Service.Entity;

namespace UserService.Controllers
{
    public class MailClient
    {
        private readonly string host;
        private readonly string username;
        private readonly string password;
        private readonly string address;
        private readonly string display;
        private readonly bool enabled;

        public MailClient(IEnumerable<SettingEntity> settings, bool enabled)
        {
            this.enabled = enabled;
            this.host = settings.FirstOrDefault(s => s.Key == "smtp_client_host").Value ?? "";
            this.username = settings.FirstOrDefault(s => s.Key == "smtp_client_username").Value ?? "";
            this.password = settings.FirstOrDefault(s => s.Key == "smtp_client_password").Value ?? "";
            this.address = settings.FirstOrDefault(s => s.Key == "email_address").Value ?? "";
            this.display = settings.FirstOrDefault(s => s.Key == "email_display_name").Value ?? "";
        }

        public void Send(EmailContentEntity email)
        {
            if (string.IsNullOrEmpty(password)
                || string.IsNullOrEmpty(host)
                || string.IsNullOrEmpty(username)
                || string.IsNullOrEmpty(address)
                || string.IsNullOrEmpty(display))
            {
                throw new Exception();
            }

            if (!enabled)
            {
                return;
            }
            else
            {
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
}
