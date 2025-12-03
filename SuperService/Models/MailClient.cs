using Cloud77.Abstractions.Entity;
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
      var model = new LocalDataModel();
      host = model.GetSetting("smtp_client_host");
      username = model.GetSetting("smtp_client_username");
      password = model.GetSetting("smtp_client_password");
      address = model.GetSetting("email_address");
      display = model.GetSetting("email_display_name");
    }

    public void Send(EmailEntity email)
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
