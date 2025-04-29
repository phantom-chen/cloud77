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

  public class User
  {
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
  }
}
