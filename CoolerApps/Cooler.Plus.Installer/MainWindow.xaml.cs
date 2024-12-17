using Squirrel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.IO;

namespace Cooler.Plus.Installer
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private string url = "";

        private UpdateManager updateManager;

        private UpdateInfo updateInfo;

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            Assembly assembly = Assembly.GetExecutingAssembly();
            var version = assembly.GetName().Version.ToString(3);
            Title = Title + $" v{version}";

            if (File.Exists("./squirrel.txt"))
            {
                url = File.ReadAllText("./squirrel.txt").Trim();
                if (!string.IsNullOrEmpty(url))
                {
                    CheckNewVersion(url);
                }
            }
        }

        private bool readyToDownload = false;
        private bool readyToApply = false;
        private async void HandleAction(object sender, RoutedEventArgs e)
        {
            action.IsEnabled = false;
            if (readyToDownload)
            {
                progress.Visibility = Visibility.Visible;
                progress.Value = 0;
                await updateManager.DownloadReleases(updateInfo.ReleasesToApply, (pg) =>
                {
                    Dispatcher.Invoke(new Action<int>((p) =>
                    {
                        progress.Value = p;
                        message.Text = p == 100 ? "Download completed" : $"Downloading update ({size} MB) {p}%";
                    }), System.Windows.Threading.DispatcherPriority.Normal, pg);
                });

                Dispatcher.Invoke(() =>
                {
                    action.Content = "Apply & Restart";
                    readyToApply = true;
                    readyToDownload = false;
                    action.IsEnabled = true;
                });
            }    
            else if (readyToApply)
            {
                Dispatcher.Invoke(() =>
                {
                    progress.Value = 0;
                });
                await updateManager.ApplyReleases(updateInfo, (pg) =>
                {
                    Dispatcher.Invoke(new Action<int>((p) =>
                    {
                        progress.Value = p;
                        message.Text = p == 100 ? "Apply completed" : $"Applying update {p}%";
                    }), System.Windows.Threading.DispatcherPriority.Normal, pg);
                });
                readyToApply = false;
                await updateManager.CreateUninstallerRegistryEntry();
                UpdateManager.RestartApp();
            }
            else
            {
                this.Close();
            }    
        }
        private int size = 0;
        private async void CheckNewVersion(string url)
        {
            try
            {
                message.Text = "Checking update ...";
                updateManager = new UpdateManager(url);
                updateInfo = await updateManager.CheckForUpdate(true, (pg) =>
                {
                    Dispatcher.Invoke(new Action<int>((p) =>
                    {
                        this.message.Text = "Checking update >>> " + pg.ToString() + "%";
                    }), System.Windows.Threading.DispatcherPriority.Normal, pg);
                });

                if (updateInfo.ReleasesToApply == null || updateInfo.ReleasesToApply.Count == 0)
                {
                    Dispatcher.Invoke(() =>
                    {
                        this.message.Text = "Current version is latest.";
                    });
                }
                else
                {
                    var newVersion = updateInfo.ReleasesToApply.FirstOrDefault();
                    size = Math.Max(1, Convert.ToInt32((newVersion.Filesize / 1024) / 1024));
                    this.message.Text = $"Find new version ({newVersion.Version.ToString()} {size} MB)";
                    action.Content = "Download";
                    readyToDownload = true;
                }
            }
            catch (Exception ex)
            {
                this.message.Text = ex.Message;
            }
            finally
            {
                action.IsEnabled = true;
            }
        }
    }
}
