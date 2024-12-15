using System;
using System.Collections.Generic;
using System.Text;

namespace Cooler.Client
{
    public enum LogLevel
    {
        Trace,
        Debug,
        Info,
        Warn,
        Error
    }
    public interface ILoggingProvider
    {
        void AppendLog(string log, LogLevel level = LogLevel.Info);
        void AppendLogs(IEnumerable<string> logs, LogLevel level = LogLevel.Info);
    }
}
