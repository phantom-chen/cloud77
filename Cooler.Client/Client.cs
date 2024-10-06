using System;
using System.Collections.Generic;
using System.Text;

namespace Cooler.Client
{
    public class CoolerClientOptions
    {
        public bool Online { get; set; } = false;

        /// <summary>
        /// Product version
        /// </summary>
        public string Version { get; set; }

        /// <summary>
        /// Application startup location
        /// </summary>
        public string StartupPath { get; set; }

        /// <summary>
        /// User data folder location
        /// </summary>
        public string UserDataPath { get; set; }

        public string UpdateEndpoint { get; set; }
    }

    public interface ICoolerClient
    {
        void Hello();
    }

    public class CoolerClient: ICoolerClient
    {
        public void Hello() { }
    }
}
