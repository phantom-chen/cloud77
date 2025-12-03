namespace SampleService.Models
{
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
}
