using Cooler.Client.Providers;
using Cooler.Plus.Models;
using Cooler.Plus.Windows;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Shapes;
using Squirrel;

namespace Cooler.Plus
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            model = new MainModel();
        }

        private readonly MainModel model;

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var window = new LoginWindow();
            window.WindowStartupLocation = WindowStartupLocation.CenterScreen;
            window.Show();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            DataContext = model;
            Task.Run(() =>
            {
                this.CheckUpdate();

            });
            windowsize.Text = this.RenderSize.Width.ToString() + " x " + this.RenderSize.Height.ToString();
        }

        private async void CheckUpdate()
        {
            var assembly = Assembly.GetExecutingAssembly();
            var location = System.IO.Path.GetDirectoryName(assembly.Location);

            var mgr = new UpdateDownloadManager(location);
            if (!string.IsNullOrEmpty(mgr.EndPoint) && mgr.HasUpdateEXE)
            {
                var manager = new UpdateManager(mgr.EndPoint);
                var info = await manager.CheckForUpdate(true);

                if (info != null && info.ReleasesToApply.Count > 0)
                {
                    Dispatcher.Invoke(() =>
                    {
                        var window = new UpdateWindow(mgr, manager, info);
                        window.ShowDialog();
                    });
                }
            }
        }

        private void ExitApplication(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void ShowAboutMe(object sender, RoutedEventArgs e)
        {
            var window = new AboutWindow();
            window.WindowStartupLocation = WindowStartupLocation.CenterScreen;
            window.ShowDialog();
        }

        private void ViewDashboard(object sender, RoutedEventArgs e)
        {
            var window = new DashboardWindow();
            window.WindowStartupLocation = WindowStartupLocation.CenterScreen;
            window.ShowDialog();
        }

        private void HideMessage(object sender, RoutedEventArgs e)
        {
            SnackbarFive.IsActive = false;
        }

        private void UserLogin(object sender, RoutedEventArgs e)
        {

        }

        private void EditSettings(object sender, RoutedEventArgs e)
        {

        }
    }
}
