using System.Reflection;

namespace SuperService.Models
{
  public class LocalDataModel
  {
    static LocalDataModel()
    {
      var location = Assembly.GetExecutingAssembly().Location;
      var root = Directory.GetParent(location)?.ToString() ?? "";
      if (!string.IsNullOrEmpty(root))
      {
        Root = Path.Combine(root, "data");
      }
      if (!string.IsNullOrEmpty(root) && !Directory.Exists(Root))
      {
        Directory.CreateDirectory(Root);
        
        if (!Directory.Exists(Path.Combine(Root, "logs")))
        {
          Directory.CreateDirectory(Path.Combine(Root, "logs"));
        }
      }
    }

    public readonly static string Root = "";

    public static string IPAddress
    {
      get
      {
        var path = Path.Combine(Root, "localhost.txt");
        if (File.Exists(path))
        {
          return File.ReadAllLines(path)[0].Trim();
        }
        return "";
      }
    }

    public void AppendLog(string message, bool isWarning = false)
    {
      var date = DateTime.Now;
      var info = isWarning ? "warning" : "info";
      File.AppendAllLines(Path.Combine(Root, "logs", $"{date.ToString("yyyy-MM-dd")}.txt"), new string[]
      {
        $"[{date.ToString("yyyy-MM-dd HH:mm:ss zzz")}] [{info}] {message}"
      });
    }

    public bool HasEmailConfirmTemplate
    {
      get { return File.Exists(Path.Combine(Root, "email-confirm.html")); }
    }

    public bool HasPasswordResetTemplate
    {
      get { return File.Exists(Path.Combine(Root, "password-reset.html")); }
    }

    public bool HasUsers
    {
      get { return File.Exists(Path.Combine(Root, "users.json")); }
    }

    public string SMTPSettings
    {
      get
      {
        var path = Path.Combine(Root, "smtp.json");
        if (File.Exists(path))
        {
          var content = File.ReadAllText(path);
          return content;
        }
        return "";
      }
    }

    public string HealthSettings
    {
      get
      {
        var path = Path.Combine(Root, "health.json");
        if (File.Exists(path))
        {
          var content = File.ReadAllText(path);
          return content;
        }
        return "";
      }
    }

    public string EventSettings
    {
      get
      {
        var path = Path.Combine(Root, "events.json");
        if (File.Exists(path))
        {
          var content = File.ReadAllText(path);
          return content;
        }
        return "";
      }
    }

    public string GenerateEmailConfirmContent(string email, string username, string link)
    {
      if (HasEmailConfirmTemplate)
      {
        var html = File.ReadAllText(Path.Combine(Root, "email-confirm.html"));
        return html.Replace("{username}", username).Replace("{email}", email).Replace("{link}", link);
      }
      return $"Email: {email}\nUser Name: {username}]nLink: {link}";
    }

    public string GeneratePasswordResetContent(string link)
    {
      if (HasPasswordResetTemplate)
      {
        var html = File.ReadAllText(Path.Combine(Root, "password-reset.html"));
        return html.Replace("{link}", link);
      }
      return link;
    }
  }

  public class User
  {
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
  }
}
