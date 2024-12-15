using Cooler.Plus.Models;
using Cooler.Plus.Windows;
using System;
using System.Collections.Generic;
using System.Linq;
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
                Dispatcher.Invoke(() =>
                {
                    var window = new UpdateWindow();
                    window.ShowDialog();
                });
            });
            windowsize.Text = this.RenderSize.Width.ToString() + " x " + this.RenderSize.Height.ToString();
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
