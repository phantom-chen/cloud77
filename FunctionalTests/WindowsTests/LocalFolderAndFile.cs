using Cloud77.Abstractions;
using FunctionalTests.Support;

namespace FunctionalTests.WindowsTests
{
  [TestClass]
  public sealed class LocalFolderAndFile : WindowsStage
  {
    [TestMethod()]
    public void ServerStaticFolderIsCorrect()
    {
      Assert.IsTrue(Directory.Exists(Data));
      Assert.IsTrue(Directory.Exists(Users));
      Assert.IsTrue(Directory.Exists(Static));
      Assert.IsTrue(Directory.Exists(ServiceDataModel.Root));

      var folders = new string[] { "installers", "releases", "json" };
      foreach (var folder in folders)
      {
        var path = Path.Combine(Static, folder);
        Assert.IsTrue(Directory.Exists(path));
      }

      var files = new string[] { "logo.png", "site.json", "welcome.mp4", "json/posts.json" };  // favicon.ico
      foreach (var file in files)
      {
        var path = Path.Combine(Static, file);
        Assert.IsTrue(File.Exists(path));
      }
    }

    [TestMethod()]
    public void ServiceDataIsCorrect()
    {
      var files = new string[] { "ocelot.json", "settings.json", "email-confirm.html", "password-reset.html", "localhost.txt" };
      foreach (var file in files)
      {
        var path = Path.Combine(Data, file);
        Assert.IsTrue(File.Exists(path));
      }

      // ocelot.json
      Console.WriteLine(string.Join("\n", ServiceDataModel.GetUpStreamPaths()));

      // *.html

      // localhost.txt
      // settings.json
    }

    [TestMethod()]
    public void ServiceSettingsAreCorrect()
    {
      Assert.IsNotNull(ServiceDataModel.Settings);
      Assert.IsNotEmpty(ServiceDataModel.Settings);
      Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "event_names"));
      Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "user_roles"));

      Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "health_check_enable"));
      Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "health_check_address"));
      Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "health_check_subject"));
      Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "health_check_body"));
      Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "health_check_hour_utc"));

      Assert.IsNotNull(ServiceDataModel.Settings.FirstOrDefault(s => s.Key == "user_resource_servers"));

    }

    [TestMethod()]
    public void UserDataIsCorrect()
    {
      // admin.json
      // tester.json
      var files = new string[] { "admin.json", "tester.json" };
      foreach (var file in files)
      {
        var path = Path.Combine(Users, file);
        Assert.IsTrue(File.Exists(path));
      }
    }
  }
}
