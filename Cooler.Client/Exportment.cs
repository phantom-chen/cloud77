using System;
using System.Collections.Generic;
using System.Text;

namespace Cooler.Client
{
    public interface IExportmentProvider
    {
        void Create(string name, string header = "", string content = "");
    }
}
