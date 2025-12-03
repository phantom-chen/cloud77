using System.Reflection;
using System.Runtime.InteropServices;

namespace GatewayService.Models
{
  public class LocalDataModel
  {
    static LocalDataModel()
    {
      var location = Assembly.GetExecutingAssembly().Location;
      var root = Directory.GetParent(location)?.ToString() ?? "";

      if (!string.IsNullOrEmpty(root))
      {
        var isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
        if (isWindows)
        {
          string programDataPath = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
          Root = Path.Combine(programDataPath, "MyServices");
        }
        else
        {
          // for Linux system
          Root = Path.Combine(root, "data");
        }
      }

      CustomLogging = Environment.GetEnvironmentVariable("CUSTOM_LOGGING") ?? "";

      if (!string.IsNullOrEmpty(root) && !Directory.Exists(Root))
      {
        Directory.CreateDirectory(Root);

        if (!Directory.Exists(Path.Combine(Root, "logs")))
        {
          Directory.CreateDirectory(Path.Combine(Root, "logs"));
        }

        if (!Directory.Exists(Path.Combine(Root, "errors")))
        {
          Directory.CreateDirectory(Path.Combine(Root, "errors"));
        }
      }
    }

    public readonly static string Root = "";

    private static string CustomLogging = "";

    private static readonly object obj = new object();

    public void AppendLog(string message, bool isWarning = false)
    {
      if (string.IsNullOrEmpty(CustomLogging)) return;
      var date = DateTime.Now;
      var info = isWarning ? "warning" : "info";
      lock (obj)
      {
        File.AppendAllLines(Path.Combine(Root, "logs", $"Gateway-{date.ToString("yyyyMMdd")}.txt"), new string[]
       {
           $"[{date.ToString("yyyy-MM-dd HH:mm:ss zzz")}] [{info}] {message}"
       });
      }
    }

    public void AppendHistory(string message)
    {
      if (string.IsNullOrEmpty(CustomLogging)) return;
      var date = DateTime.Now;
      lock (obj)
      {
        File.AppendAllText(Path.Combine(Root, "logs", $"{date.ToString("yyyyMMdd")}.txt"), $"======\n{message}\n======\n");
      }
    }
  }
}
