using Cooler.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows;
using System.IO;
using Cooler.Client.Providers;

namespace Cooler.Plus
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        public static CoolerClient CoolerClient { get; private set; }

        private void Application_Startup(object sender, StartupEventArgs e)
        {
            var docs = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            var assembly = Assembly.GetExecutingAssembly();
            var appName = "Cooler";
            var userData = Path.Combine(docs, appName);

#if DEBUG
            userData += "_debug";
#endif

            var version = assembly.GetName().Version.ToString(3);
            var url = "";
            if (File.Exists("./squirrel.txt"))
            {
                url = File.ReadAllText("./squirrel.txt").Trim();
            }

            var options = new CoolerClientOptions()
            {
                Online = false,
                Version = version,
                StartupPath = Directory.GetParent(assembly.Location).FullName,
                UserDataPath = userData,
                UpdateEndpoint = url,
            };
            CoolerClient.Options = options;
            CoolerClient = new CoolerClient();

            new UserDataProvider(options.StartupPath, options.UserDataPath);
            new LoggingProvider(Path.Combine(options.UserDataPath, "logs"));
        }

        private void Application_Exit(object sender, ExitEventArgs e)
        {

        }
    }
}
