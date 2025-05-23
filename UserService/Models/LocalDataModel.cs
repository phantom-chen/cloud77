using System.Reflection;

namespace UserService.Models
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

        if (!Directory.Exists(Path.Combine(Root, "users")))
        {
          Directory.CreateDirectory(Path.Combine(Root, "users"));
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
  }

  public class LocalUserDataModel
  {
    public LocalUserDataModel(string email)
    {
      email = email.Trim().ToLower();

      this.email = email;

      if (!Directory.Exists(LocalDataModel.Root))
      {
        Directory.CreateDirectory(LocalDataModel.Root);
      }

      if (!Directory.Exists(Path.Combine(LocalDataModel.Root, "users")))
      {
        Directory.CreateDirectory(Path.Combine(LocalDataModel.Root, "users"));
      }

      if (!Directory.Exists(Path.Combine(LocalDataModel.Root, "users", email)))
      {
        Directory.CreateDirectory(Path.Combine(LocalDataModel.Root, "users", email));
      }

      if (!Directory.Exists(Path.Combine(LocalDataModel.Root, "users", email, "posts")))
      {
        Directory.CreateDirectory(Path.Combine(LocalDataModel.Root, "users", email, "posts"));
      }
    }

    private readonly string email;

    public string GetPost(string id)
    {
      if (File.Exists(Path.Combine(LocalDataModel.Root, "users", email, "posts", id)))
      {
        return File.ReadAllText(Path.Combine(LocalDataModel.Root, "users", email, "posts", id));
      }
      return "";
    }

    public void UpdatePost(string id, string content)
    {
      var filePath = Path.Combine(LocalDataModel.Root, "users", email, "posts", id);
      if (File.Exists(filePath))
      {
        File.Delete(filePath);
      }
      File.WriteAllText(filePath, content);
    }

    public void DeletePost(string id)
    {
      var filePath = Path.Combine(LocalDataModel.Root, "users", email, "posts", id);
      if (File.Exists(filePath))
      {
        File.Delete(filePath);
      }
    }
  }
}
