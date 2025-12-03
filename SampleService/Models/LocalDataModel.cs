using System.Reflection;
using System.Runtime.InteropServices;

namespace SampleService.Models
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
            }
        }

        public LocalDataModel()
        {
            UploadFolder = Path.Combine(Root, "sample", "uploads");
            if (!Directory.Exists(UploadFolder))
            {
                Directory.CreateDirectory(UploadFolder);
            }

            PostFolder = Path.Combine(Root, "sample", "posts");
            if (!Directory.Exists(PostFolder))
            {
                Directory.CreateDirectory(PostFolder);
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
            var date = DateTime.Now;
            lock (obj)
            {
                File.AppendAllLines(Path.Combine(Root, "logs", $"Sample-{date.ToString("yyyyMMdd")}.txt"), logs);
            }
        }

        public readonly string UploadFolder = "";

        public readonly string PostFolder = "";

        public string GetFilePath(string name)
        {
            return Path.Combine(UploadFolder, name);
        }

        public string[] GetFiles()
        {
            string[] files = Directory.GetFiles(UploadFolder).Select(f => Path.GetFileName(f)).ToArray();
            return files;
        }

        public bool DeleteFile(string name)
        {
            var filePath = Path.Combine(UploadFolder, name);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }
            return false;
        }

        public string[] GetPosts()
        {
            string[] txtFiles = Directory.GetFiles(PostFolder, "*.md");
            return txtFiles.Select(f => Path.GetFileNameWithoutExtension(f)).ToArray();
        }

        public bool PostIsExisting(string name)
        {
            return File.Exists(Path.Combine(PostFolder, name + ".md"));
        }

        public string GetPost(string name)
        {
            var filePath = Path.Combine(PostFolder, name + ".md");
            return File.ReadAllText(filePath);
        }

        public string SavePost(string name, string content)
        {
            var filePath = Path.Combine(PostFolder, name + ".md");
            File.WriteAllText(filePath, content);
            return filePath;
        }

        public void DeletePost(string name)
        {
            var filePath = Path.Combine(PostFolder, name + ".md");
            File.Delete(filePath);
        }
    }
}
