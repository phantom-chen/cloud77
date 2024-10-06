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
            var window = new UpdateWindow();
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
        }

        private void ExitApplication(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void ShowAboutMe(object sender, RoutedEventArgs e)
        {
            var window = new AboutWindow();
            window.ShowDialog();
        }
    }
}
