using Cloud77.Service.Entity;
using Newtonsoft.Json;
using System.Net;
using System.Net.Mail;

namespace SuperService.Models
{
  public class MailClient
  {
    private readonly string host;
    private readonly string username;
    private readonly string password;
    private readonly string address;
    private readonly string display;

    public MailClient()
    {
      var content = new LocalDataModel().SMTPSettings;
      if (!string.IsNullOrEmpty(content))
      {
        var settings = JsonConvert.DeserializeObject<IEnumerable<SettingEntity>>(content);
        host = settings.FirstOrDefault(s => s.Key == "smtp_client_host").Value ?? "";
        username = settings.FirstOrDefault(s => s.Key == "smtp_client_username").Value ?? "";
        password = settings.FirstOrDefault(s => s.Key == "smtp_client_password").Value ?? "";
        address = settings.FirstOrDefault(s => s.Key == "email_address").Value ?? "";
        display = settings.FirstOrDefault(s => s.Key == "email_display_name").Value ?? "";
      }
    }

    public void Send(EmailContentEntity email)
    {
      // only send to one email address
      var count = email.Addresses.Count();
      if (count != 1)
      {
        return;
      }

      // save mail body locally
      File.WriteAllText(Path.Combine(LocalDataModel.Root, "mail-body.txt"), email.Body);

      // skip for empty setting
      if (string.IsNullOrEmpty(password)
          || string.IsNullOrEmpty(host)
          || string.IsNullOrEmpty(username)
          || string.IsNullOrEmpty(address)
          || string.IsNullOrEmpty(display))
      {
        return;
      }

      if (email.Addresses.First().ToLower().EndsWith("@example.com"))
      {
        return;
      }

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
