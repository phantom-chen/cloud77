using System.Net;
using System.Net.NetworkInformation;

namespace ConsoleApp
{
    internal class Program
    {
        private static FileDownload download = new FileDownload();

        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            Console.WriteLine(Environment.MachineName);
            Environment.GetFolderPath(Environment.SpecialFolder.Desktop);

            Console.WriteLine(Directory.GetCurrentDirectory());
            Console.WriteLine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments));
            Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            Console.WriteLine((args.Length > 0 ? string.Join(" ", args) : "no arg"));

            // Get the server computer name 
            string hostname = Dns.GetHostName();
            Console.WriteLine(hostname);

            var items = NetworkInterface.GetAllNetworkInterfaces();
            foreach (var item in items)
            {
                Console.WriteLine(item.Description);

            }

            foreach (var item in Dns.GetHostAddresses(hostname))
            {
                if (!item.IsIPv6LinkLocal)
                {
                    Console.WriteLine(item.ToString());
                }
            }

            Console.WriteLine("Please press your input: ");
            var line = Console.ReadLine();
            Console.WriteLine("Your input is " + line);
            Console.WriteLine("Press any key to exit");
            Console.ReadKey();
        }
    }
}
