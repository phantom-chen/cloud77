using System.Reflection;

namespace SuperService.Models
{
  public class LocalDataModel
  {
    static LocalDataModel()
    {
      var root = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
      Root = Path.Combine(root, "data");
      if (!Directory.Exists(Root))
      {
        Directory.CreateDirectory(Root);
      }
      if (!Directory.Exists(Path.Combine(Root, "logs")))
      {
        Directory.CreateDirectory(Path.Combine(Root, "logs"));
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

    public string GenerateEmailConfirmContent(string email, string username, string link)
    {
      return "";
    }
  }

  public class User
  {
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
  }
}
