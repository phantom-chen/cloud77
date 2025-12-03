using System.Reflection;
using System.Runtime.InteropServices;

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

                if (!Directory.Exists(Path.Combine(Root, "users")))
                {
                    Directory.CreateDirectory(Path.Combine(Root, "users"));
                }
            }
        }

        public readonly static string Root = "";

        public static string CustomLogging { get; private set; } = "";

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

        public void AppendLogs(IEnumerable<string> logs)
        {
            if (string.IsNullOrEmpty(CustomLogging)) return;
            var date = DateTime.Now;
            lock (obj)
            {
                File.AppendAllLines(Path.Combine(Root, "logs", $"User-{date.ToString("yyyyMMdd")}.txt"), logs);
            }
        }
    }

    public class TextLoggingModel
    {
        public TextLoggingModel() { }

        public void AppendLog(string message, bool isWarning = false)
        {
            if (string.IsNullOrEmpty(LocalDataModel.CustomLogging)) return;
            var date = DateTime.Now;
            var info = isWarning ? "warning" : "info";
            var logs = new string[]
                {
                    $"[{date.ToString("yyyy-MM-dd HH:mm:ss zzz")}] [{info}] {message}"
                };
            model.AppendLogs(logs);
        }

        private LocalDataModel model = new LocalDataModel();

        private List<string> logs = new List<string>();

        public void PushLog(string message, bool isWarning = false)
        {
            var date = DateTime.Now;
            var info = isWarning ? "warning" : "info";
            logs.Add($"[{date.ToString("yyyy-MM-dd HH:mm:ss zzz")}] [{info}] {message}");
        }

        public void Commit()
        {
            if (string.IsNullOrEmpty(LocalDataModel.CustomLogging)) return;
            var date = DateTime.Now;
            if (logs.Count > 0)
            {
                model.AppendLogs(logs);
                logs.Clear();
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
