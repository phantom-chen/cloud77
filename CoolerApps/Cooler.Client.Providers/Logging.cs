using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooler.Client.Providers
{
    public class LoggingProvider : ILoggingProvider
    {
        private string directory;
        private string logPath;
        public LoggingProvider(string directory)
        {
            this.directory = directory;
            if (!Directory.Exists(this.directory))
            {
                Directory.CreateDirectory(this.directory);
            }

            var date = DateTime.Now.ToString("yyyyMMdd");
            logPath = Path.Combine(directory, date + ".txt");
            if (!File.Exists(logPath))
            {
                File.WriteAllText(logPath, "");
            }

            this.directory = directory;
        }

        private string MapLevel(LogLevel level)
        {
            switch (level)
            {
                case LogLevel.Trace:
                    return "Trace";
                case LogLevel.Debug:
                    return "Debug";
                case LogLevel.Info:
                    return "Info";
                case LogLevel.Warn:
                    return "Warn";
                case LogLevel.Error:
                    return "Error";
                default:
                    return "Info";
            }
        }

        public void AppendLog(string log, LogLevel level = LogLevel.Info)
        {
            AppendLogs(new string[] { log }, level);
        }

        public void AppendLogs(IEnumerable<string> logs, LogLevel level = LogLevel.Info)
        {
            Task.Factory.StartNew(() =>
            {
                var lines = logs.Select(l => $"[{DateTime.Now}] [{MapLevel(level)}] >>> {l}");
                File.AppendAllLines(logPath, lines);
            });
        }
    }
}
