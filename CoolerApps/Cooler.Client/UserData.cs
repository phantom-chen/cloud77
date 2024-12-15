using System;
using System.Collections.Generic;
using System.Text;

namespace Cooler.Client
{
    public interface IUserDataProvider
    {
        string Directory { get; }
        bool IsEmpty { get; }
        void WriteContent(string file, string content);
        string GetContent(string file);
        bool HasFile(string file);
        UserSettings UserSettings { get; }
    }
}
