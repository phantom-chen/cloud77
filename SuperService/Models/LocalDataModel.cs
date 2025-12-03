using Cloud77.Abstractions.Entity;
using Newtonsoft.Json;
using System.Reflection;
using System.Runtime.InteropServices;

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
            }
            if (!Directory.Exists(Path.Combine(Root, "logs")))
            {
                Directory.CreateDirectory(Path.Combine(Root, "logs"));
            }
            if (!Directory.Exists(Path.Combine(Root, "users")))
            {
                Directory.CreateDirectory(Path.Combine(Root, "users"));
            }
            if (!Directory.Exists(Path.Combine(Root, "users", "index")))
            {
                Directory.CreateDirectory(Path.Combine(Root, "users", "index"));
            }
        }

        public readonly static string Root = "";

        private static string CustomLogging = "";

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

        private static readonly object obj = new object();

        public void AppendLog(string message, bool isWarning = false, bool timestampIgnored = false)
        {
            if (string.IsNullOrEmpty(CustomLogging)) return;
            var date = DateTime.Now;
            var info = isWarning ? "warning" : "info";
            lock (obj)
            {
                File.AppendAllLines(Path.Combine(Root, "logs", $"Super-{date.ToString("yyyyMMdd")}.txt"), new string[]
                {
        timestampIgnored ? message : $"[{date.ToString("yyyy-MM-dd HH:mm:ss zzz")}] [{info}] {message}"
                });
            }
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
            get { return File.Exists(Path.Combine(Root, "users", "index", "users.json")); }
        }

        public string Settings
        {
            get
            {
                var path = Path.Combine(Root, "settings.json");
                if (File.Exists(path))
                {
                    var content = File.ReadAllText(path);
                    return content;
                }
                return "";
            }
        }

        public IEnumerable<SettingEntity> GetSettings()
        {
            if (string.IsNullOrEmpty(Settings))
            {
                return null;
            }

            var settings = JsonConvert.DeserializeObject<IEnumerable<SettingEntity>>(Settings);
            return settings;
        }
        public string GetSetting(string key)
        {
            if (string.IsNullOrEmpty(Settings))
            {
                return "";
            }

            var settings = JsonConvert.DeserializeObject<IEnumerable<SettingEntity>>(Settings);
            var setting = settings.FirstOrDefault(s => s.Key == key);
            return setting?.Value ?? "";
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
