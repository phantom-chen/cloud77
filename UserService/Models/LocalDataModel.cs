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
}
