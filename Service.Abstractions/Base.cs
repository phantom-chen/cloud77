using Cloud77.Abstractions.Entity;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Linq;

namespace Cloud77.Abstractions
{
    public interface IUserResult
    {
        string Email { get; set; }
    }

    public class BaseQuery
    {
        public int Index { get; set; } = 0;
        public int Size { get; set; } = 10;
        public string Sort { get; set; } = "desc";
    }

    public class QueryResults
    {
        public int Total { get; set; }
        public string Query { get; set; }
        public int Index { get; set; }
        public int Size { get; set; }
    }

    /// <summary>
    /// Represents data related to a service operation or context.
    /// ocelot.json
    /// </summary>

    public class ServiceDataModel
    {
        /// <summary>
        /// Windows or Linux system platform.
        /// </summary>
        public static string Platform { get; set; }

        public static string Root { get; set; }

        public static string LogFileExtension { get; set; }

        public static string ServiceName { get; set; }

        public static List<SettingEntity> Settings { get; set; } = new List<SettingEntity>();

        public static void Initialize()
        {
            // Platform and Root should be provided
            if (!string.IsNullOrEmpty(Root))
            {
                if (!Directory.Exists(Root))
                {
                    Directory.CreateDirectory(Root);
                }

                var folders = new string[] { "errors", "histories", "logs", "users" };
                foreach (var item in folders)
                {
                    if (!Directory.Exists(Path.Combine(Root, item)))
                    {
                        Directory.CreateDirectory(Path.Combine(Root, item));
                    }
                }

                HasEmailConfirmTemplate = File.Exists(Path.Combine(Root, "email-confirm.html"));
                HasPasswordResetTemplate = File.Exists(Path.Combine(Root, "password-reset.html"));

                var path = Path.Combine(Root, "localhost.txt");
                if (File.Exists(path))
                {
                    IPAddress = File.ReadAllLines(path)[0].Trim();
                }
            }
        }

        private static Dictionary<string, string> variables = new Dictionary<string, string>();

        public static void UpdateVariable(string key, string value)
        {
            if (!string.IsNullOrEmpty(ServiceDataModel.IPAddress))
            {
                value = value.Replace("localhost", ServiceDataModel.IPAddress);
            }

            if (variables.ContainsKey(key))
            {
                variables[key] = value;
                return;
            }
            else
            {
                variables.Add(key, value);
            }
        }

        public static string GetVariable(string key)
        {
            if (variables.ContainsKey(key))
            {
                return variables[key];
            }
            return "";
        }

        public static string GetContent(string file)
        {
            var path = Path.Combine(Root, file);
            if (File.Exists(path))
            {
                return File.ReadAllText(path);
            }
            return "";
        }

        public static string IPAddress { get; private set; } = "";

        public static bool HasEmailConfirmTemplate { get; private set; }

        public static bool HasPasswordResetTemplate { get; private set; }

        public static string GetSetting(string key)
        {
            if (Settings.Count == 0) return "";

            var setting = Settings.FirstOrDefault(s => s.Key == key);
            return setting?.Value ?? "";
        }

        public static string GenerateEmailConfirmContent(string email, string username, string link)
        {
            if (HasEmailConfirmTemplate)
            {
                var html = File.ReadAllText(Path.Combine(Root, "email-confirm.html"));
                return html.Replace("{username}", username).Replace("{email}", email).Replace("{link}", link);
            }
            return $"Email: {email}\nUser Name: {username}]nLink: {link}";
        }

        public static string GeneratePasswordResetContent(string link)
        {
            if (HasPasswordResetTemplate)
            {
                var html = File.ReadAllText(Path.Combine(Root, "password-reset.html"));
                return html.Replace("{link}", link);
            }
            return link;
        }

        public static string GetLatestMailBody()
        {
            if (!File.Exists(Path.Combine(Root, "mail-body.txt")))
            {
                return File.ReadAllText(Path.Combine(Root, "mail-body.txt"));
            }
            return "";
        }

        public static void SaveLatestMailBody(string content)
        {
            File.WriteAllText(Path.Combine(Root, "mail-body.txt"), content);
        }

        public static string[] GetUpStreamPaths()
        {
            if (File.Exists(Path.Combine(Root, "ocelot.json")))
            {
                var lines = File.ReadAllLines(Path.Combine(Root, "ocelot.json"));
                lines = lines.Where(l => l.Contains("UpstreamPathTemplate")).ToArray();
                lines = lines.Select(l => l.Trim().Replace("\"UpstreamPathTemplate\": ", "").Trim().Trim(',')).ToArray();
                lines = lines.Select(l => l.Replace("\"", "")).ToArray();
                return lines;
            }
            return new string[] {};
        }
    }

    public class SampleDataModel
    {
        public SampleDataModel()
        {
            var sampleFolder = Path.Combine(ServiceDataModel.Root, "sample");
            uploadFolder = Path.Combine(sampleFolder, "uploads");
            postFolder = Path.Combine(sampleFolder, "posts");
            
            if (!Directory.Exists(sampleFolder))
            {
                Directory.CreateDirectory(sampleFolder);
            }

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            if (!Directory.Exists(postFolder))
            {
                Directory.CreateDirectory(postFolder);
            }
        }

        private string uploadFolder = "";

        private string postFolder = "";

        public string GetFilePath(string name)
        {
            return Path.Combine(uploadFolder, name);
        }

        public string[] GetFiles()
        {
            string[] files = Directory.GetFiles(uploadFolder).Select(f => Path.GetFileName(f)).ToArray();
            return files;
        }

        public bool DeleteFile(string name)
        {
            var filePath = Path.Combine(uploadFolder, name);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }
            return false;
        }

        public string[] GetPosts()
        {
            string[] txtFiles = Directory.GetFiles(postFolder, "*.md");
            return txtFiles.Select(f => Path.GetFileNameWithoutExtension(f)).ToArray();
        }

        public bool PostIsExisting(string name)
        {
            return File.Exists(Path.Combine(postFolder, name + ".md"));
        }

        public string GetPost(string name)
        {
            var filePath = Path.Combine(postFolder, name + ".md");
            return File.ReadAllText(filePath);
        }

        public string SavePost(string name, string content)
        {
            var filePath = Path.Combine(postFolder, name + ".md");
            File.WriteAllText(filePath, content);
            return filePath;
        }

        public void DeletePost(string name)
        {
            var filePath = Path.Combine(postFolder, name + ".md");
            File.Delete(filePath);
        }
    }
        
    /// <summary>
    /// user folder, index folder.
    /// </summary>
    public class UserDataModel
    {
        public UserDataModel(string email)
        {
            email = email.Trim().ToLower();
            this.email = email;
            userDataRoot = Path.Combine(ServiceDataModel.Root, "users", email);
            if (!Directory.Exists(userDataRoot))
            {
                Directory.CreateDirectory(userDataRoot);
            }

            if (!Directory.Exists(Path.Combine(userDataRoot, "posts")))
            {
                Directory.CreateDirectory(Path.Combine(userDataRoot, "posts"));
            }
        }

        public UserDataModel()
        {
            if (!Directory.Exists(Path.Combine(ServiceDataModel.Root, "users", "index")))
            {
                Directory.CreateDirectory(Path.Combine(ServiceDataModel.Root, "users", "index"));
            }
        }

        private readonly string email;
        private readonly string userDataRoot;

        public bool HasUsers
        {
            get { return File.Exists(Path.Combine(ServiceDataModel.Root, "users", "index", "users.json")); }
        }

        public string GetPost(string id)
        {
            if (File.Exists(Path.Combine(userDataRoot, "posts", id)))
            {
                return File.ReadAllText(Path.Combine(userDataRoot, "posts", id));
            }
            return "";
        }

        public void UpdatePost(string id, string content)
        {
            var filePath = Path.Combine(userDataRoot, "posts", id);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            File.WriteAllText(filePath, content);
        }

        public void DeletePost(string id)
        {
            var filePath = Path.Combine(userDataRoot, "posts", id);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }

    public class TextLoggingModel
    {
        private static readonly object obj = new object();

        public TextLoggingModel() { }

        private void writeLogs(IEnumerable<string> logs)
        {
            var date = DateTime.Now;
            lock (obj)
            {
                File.AppendAllLines(Path.Combine(ServiceDataModel.Root, "logs", $"{ServiceDataModel.ServiceName}-{date.ToString("yyyyMMdd")}.txt"), logs);
            }
        }

        public void AppendLog(string message, bool isWarning = false, DateTime? date = null)
        {
            var _date = date ?? DateTime.Now;
            var info = isWarning ? "warning" : "info";
            
            logs.Clear();
            logs.Add($"[{_date.ToString("yyyy-MM-dd HH:mm:ss zzz")}] [{info}] {message}");
            writeLogs(logs);
        }

        private List<string> logs = new List<string>();

        public void PushLog(string message, bool isWarning = false, DateTime? date = null)
        {
            var _date = date ?? DateTime.Now;
            var info = isWarning ? "warning" : "info";
            logs.Add($"[{_date.ToString("yyyy-MM-dd HH:mm:ss zzz")}] [{info}] {message}");
        }

        public void Commit()
        {
            if (string.IsNullOrEmpty(ServiceDataModel.LogFileExtension)) return;
            if (logs.Count > 0)
            {
                writeLogs(logs);
                logs.Clear();
            }
        }

        public void SaveError(string message)
        {
            var id = Guid.NewGuid().ToString();
            if (!string.IsNullOrEmpty(ServiceDataModel.LogFileExtension))
            {
                File.WriteAllText(Path.Combine(ServiceDataModel.Root, "errors", $"{id}.txt"), message);
            }
        }

        public string GetLog(string service, string date)
        {
            service = service.ToLower();
            service = char.ToUpper(service[0]) + service.Substring(1).ToLower();
            var path = Path.Combine(ServiceDataModel.Root, "logs", $"{service}-{date}.txt");
            if (File.Exists(path))
            {
                return File.ReadAllText(path);
            }
            return "";
        }

        public string GetError(string id)
        {
            var path = Path.Combine(ServiceDataModel.Root, "errors", $"{id}.txt");
            if (File.Exists(path))
            {
                return File.ReadAllText(path);
            }
            return "";
        }

        public string GetHistory(string date)
        {
            var path = Path.Combine(ServiceDataModel.Root, "logs", $"{date}.txt");
            if (File.Exists(path))
            {
                return File.ReadAllText(path);
            }
            return "";
        }
    }
}
