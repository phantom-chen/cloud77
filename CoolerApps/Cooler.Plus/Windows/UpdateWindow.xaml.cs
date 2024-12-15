using Squirrel;
using System;
using System.Collections.Generic;
using System.IO;
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
using System.Windows.Shapes;

namespace Cooler.Plus.Windows
{
    /// <summary>
    /// Interaction logic for UpdateWindow.xaml
    /// </summary>
    public partial class UpdateWindow : Window
    {
        public UpdateManager updateManager;

        private UpdateInfo updateInfo;

        public UpdateWindow()
        {
            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var location = System.IO.Path.GetDirectoryName(assembly.Location);
            var hasUpdate = true;
            var version = assembly.GetName().Version.ToString(3);
            Title = "Cooler Plus" + $" v{version}";
#if DEBUG
            //hasUpdate = false;
#endif

            var p = Directory.GetParent(location).ToString();
            if (!File.Exists(System.IO.Path.Combine(p, "Update.exe")))
            {
                hasUpdate = false;
            }

            var url = "";
            if (!File.Exists(System.IO.Path.Combine(location, "squirrel.txt")))
            {
                hasUpdate = false;
            }
            else
            {
                url = File.ReadAllText(System.IO.Path.Combine(location, "squirrel.txt")).Trim();
            }

            if (string.IsNullOrEmpty(url))
            {
                hasUpdate = false;
            }
            var prod = true;
#if DEBUG
            prod = false;
#endif

            if (hasUpdate && prod)
            {
                Task.Run(() =>
                {
                    CheckNewVersion(url);
                });
            }
            else
            {
                this.Close();
            }
        }

        private bool findNewUpdate = false;
        private string newUpdateVersion = "";
        private int newUpdateSize = 0;

        private async void CheckNewVersion(string url)
        {
            try
            {
                if (string.IsNullOrEmpty(url))
                {
                    return;
                }
                // check if update.exe exists
                updateManager = new UpdateManager(url);
                updateInfo = await updateManager.CheckForUpdate(true, (pg) =>
                {
                    Dispatcher.Invoke(new Action<int>((p) =>
                    {
                        header.Text = "Checking update ... " + pg.ToString() + "%";
                    }), System.Windows.Threading.DispatcherPriority.Normal, pg);
                });

                if (updateInfo.ReleasesToApply == null || updateInfo.ReleasesToApply.Count == 0)
                {
                    Dispatcher.Invoke(new Action(() =>
                    {
                        noUpdate.Content = "Your version is latest";
                    }));
                }
                else
                {
                    findNewUpdate = true;
                    var newVersion = updateInfo.ReleasesToApply.FirstOrDefault();
                    newUpdateVersion = newVersion.Version.ToString();
                    newUpdateSize = Math.Max(1, Convert.ToInt32((newVersion.Filesize / 1024) / 1024));
                    Dispatcher.Invoke(new Action(() =>
                    {
                        header.Text = $"Find update ({newUpdateVersion}), Size: {newUpdateSize} MB";
                        noUpdate.Content = "Skip, Not For Now";
                        download.Visibility = Visibility.Visible;
                    }));
                }
                progress.Visibility = Visibility.Hidden;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                //if (!findNewUpdate)
                //{
                //    Dispatcher.Invoke(() =>
                //    {
                //        var window = new MainWindow();
                //        window.Show();
                //        this.Close();
                //    });
                //}
            }
        }

        private async void HandleAction(object sender, RoutedEventArgs e)
        {
            if (findNewUpdate)
            {
                noUpdate.IsEnabled = false;
                download.IsEnabled = false;
                progress.Visibility = Visibility.Visible;
                progress.IsIndeterminate = false;
                progress.Value = 0;
                await updateManager.DownloadReleases(updateInfo.ReleasesToApply, (pg) =>
                {
                    Dispatcher.Invoke(new Action<int>((p) =>
                    {
                        progress.Value = p;
                        header.Text = $"Downloading update {p}%";
                        if (p == 100)
                        {
                            apply.Visibility = Visibility.Visible;
                        }
                    }), System.Windows.Threading.DispatcherPriority.Normal, pg);
                });
            }
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            updateManager?.Dispose();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            updateManager?.Dispose();
            this.Close();
        }

        private async void Button_Click_1(object sender, RoutedEventArgs e)
        {
            apply.IsEnabled = false;
            var debugMode = false;
#if DEBUG
            debugMode = true;
#endif

            if (!debugMode)
            {
                await updateManager.ApplyReleases(updateInfo, (pg) =>
                {
                    Dispatcher.Invoke(new Action<int>((p) =>
                    {
                        progress.Value = p;
                        header.Text = $"Applying update {p}%";
                    }), System.Windows.Threading.DispatcherPriority.Normal, pg);
                });
                await updateManager.CreateUninstallerRegistryEntry();
                updateManager?.Dispose();
                UpdateManager.RestartApp();
            }
            else
            {
                updateManager?.Dispose();
                this.Close();
            }
        }
    }
}
