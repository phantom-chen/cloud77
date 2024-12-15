using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooler.Client.Providers
{
    public class UserDataProvider : IUserDataProvider
    {
        public UserDataProvider(
            string startUp,
            string directory)
        {
            this.directroy = directory;
            if (!System.IO.Directory.Exists(directory))
            {
                System.IO.Directory.CreateDirectory(directory);
            }
            if (!File.Exists(Path.Combine(directory, "Cooler.db")))
            {
                File.Copy(
                    Path.Combine(startUp, "Cooler.db"),
                    Path.Combine(directory, "Cooler.db"));
            }
            if (!File.Exists(Path.Combine(directory, "person.yaml")))
            {
                File.Copy(
                    Path.Combine(startUp, "person.yaml"),
                    Path.Combine(directory, "person.yaml"));
            }
            if (!File.Exists(Path.Combine(directory, "settings.json")))
            {
                var settings = new UserSettings()
                {
                    Email = "",
                    Key = "",
                    Token = "",
                    SavePassword = false,
                    AutoLogin = false,
                    Theme = "Blue",
                    Language = "English",
                    Currency = "USD",
                    Unit = "SI",
                    EnableThousandSeporator = false
                };
                var content = JsonConvert.SerializeObject(settings, Formatting.Indented);
                WriteContent("settings.json", content);
            }
        }

        private string directroy;
        public string Directory => directroy;

        public bool IsEmpty => true;

        public UserSettings UserSettings
        {
            get
            {
                var content = GetContent("settings.json");
                return JsonConvert.DeserializeObject<UserSettings>(content);
            }
        }

        public string GetContent(string file)
        {
            if (HasFile(file))
            {
                return File.ReadAllText(Path.Combine(directroy, file));
            }
            throw new NotImplementedException();
        }

        public bool HasFile(string file)
        {
            return File.Exists(Path.Combine(directroy, file));
        }

        public void WriteContent(string file, string content)
        {
            File.WriteAllText(Path.Combine(directroy, file), content);
        }
    }
}
