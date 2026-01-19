using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;

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
    /// windows or linux system
    /// service data (system)
    /// sample data (public)
    /// email-confirm.html, password-reset.html
    /// settings.json
    /// ocelot.json
    /// mail-body.txt
    /// localhost.txt
    /// </summary>

    public class ServiceDataModel
    {
        private static readonly object obj = new object();

        /// <summary>
        /// Windows or Linux system platform.
        /// </summary>
        public static string Platform { get; set; }

        public static string Root { get; set; }

        public static string LogFileExtension { get; set; }

        public static string ServiceName { get; set; }

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
            }
        }

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

        public void AppendLogs(IEnumerable<string> logs)
        {
            if (string.IsNullOrEmpty(LogFileExtension)) return;
            var date = DateTime.Now;
            lock (obj)
            {
                File.AppendAllLines(Path.Combine(Root, "logs", $"{ServiceName}-{date.ToString("yyyyMMdd")}.txt"), logs);
            }
        }

        public void SaveError(string message)
        {
            var id = Guid.NewGuid().ToString();
            if (!string.IsNullOrEmpty(LogFileExtension))
            {
                File.WriteAllText(Path.Combine(Root, "errors", $"{id}.txt"), message);
            }
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

        // users under the root

        // user folder

        // index folder

        private readonly string email;
        private readonly string userDataRoot;

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
        public TextLoggingModel() { }

        public void AppendLog(string message, bool isWarning = false)
        {
            if (string.IsNullOrEmpty(ServiceDataModel.LogFileExtension)) return;
            var date = DateTime.Now;
            var info = isWarning ? "warning" : "info";
            var logs = new string[]
                {
                    $"[{date.ToString("yyyy-MM-dd HH:mm:ss zzz")}] [{info}] {message}"
                };
            model.AppendLogs(logs);
        }

        private ServiceDataModel model = new ServiceDataModel();

        private List<string> logs = new List<string>();

        public void PushLog(string message, bool isWarning = false)
        {
            var date = DateTime.Now;
            var info = isWarning ? "warning" : "info";
            logs.Add($"[{date.ToString("yyyy-MM-dd HH:mm:ss zzz")}] [{info}] {message}");
        }

        public void Commit()
        {
            if (string.IsNullOrEmpty(ServiceDataModel.LogFileExtension)) return;
            var date = DateTime.Now;
            if (logs.Count > 0)
            {
                model.AppendLogs(logs);
                logs.Clear();
            }
        }
    }
}
