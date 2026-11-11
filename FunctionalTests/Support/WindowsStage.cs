using Cloud77.Abstractions;
using Cloud77.Abstractions.Entity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace FunctionalTests.Support
{
  public class WindowsStage
  {
    public WindowsStage()
    {
      string profile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
      server = Path.Combine(profile, "server");

      if (!Directory.Exists(Data))
      {
        Directory.CreateDirectory(Data);
      }
      if (!Directory.Exists(Users))
      {
        Directory.CreateDirectory(Users);
      }
      if (!Directory.Exists(Static))
      {
        Directory.CreateDirectory(Static);
      }

      ServiceDataModel.Root = Data;
      ServiceDataModel.ServiceName = "Default";
      ServiceDataModel.Platform = "Windows";

      ServiceDataModel.LogFileExtension = "txt";
      ServiceDataModel.Initialize();
      var content = ServiceDataModel.GetContent("settings.json");
      if (!string.IsNullOrEmpty(content))
      {
        ServiceDataModel.Settings = JsonConvert.DeserializeObject<List<SettingEntity>>(content);
      }
    }

    private string server = "";

    public string Data => Path.Combine(server, "data");
    public string Users => Path.Combine(server, "users");
    public string Static => Path.Combine(server, "wwwroot");
  }
}
