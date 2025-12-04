using System.Net.NetworkInformation;
using System.Runtime.InteropServices;

namespace ConsoleApp
{
  internal class Program
  {
    static void Main(string[] args)
    {
      // Check if running on Windows
      if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
      {
        Console.WriteLine("Running on Windows");
      }
      // Check if running on Linux
      else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
      {
        Console.WriteLine("Running on Linux");
      }
      //TestSaveFile();

      Console.WriteLine("Hello, World!");
      Console.WriteLine("Please press your input: ");
      var line = Console.ReadLine();
      Console.Clear();
      Console.WriteLine("Your input is " + line);
      Console.WriteLine("Press any key to exit");
      Console.ReadKey();
    }

    static void GetNetworkInterfaces()
    {
      NetworkInterface[] networkInterfaces = NetworkInterface.GetAllNetworkInterfaces().Where(n => n.OperationalStatus == OperationalStatus.Up && n.NetworkInterfaceType != NetworkInterfaceType.Loopback && n.NetworkInterfaceType != NetworkInterfaceType.Wireless80211).ToArray();
      foreach (NetworkInterface networkInterface in networkInterfaces)
      {
        IPInterfaceProperties ipProperties = networkInterface.GetIPProperties();
        foreach (UnicastIPAddressInformation unicastAddress in ipProperties.UnicastAddresses)
        {
          if (!unicastAddress.Address.IsIPv6LinkLocal)
          {
            //Console.WriteLine("");
            //Console.WriteLine($"Network Interface: {networkInterface.Name}");
            //Console.WriteLine($"IPv4 Address: {unicastAddress.Address}");
            //Console.WriteLine($"Description: {networkInterface.Description}");
            //Console.WriteLine($"Status: {networkInterface.OperationalStatus}");
            //Console.WriteLine("");
            //Console.WriteLine($"Speed: {networkInterface.Speed} bits per second");
          }
        }
      }

    }

    static void TestSaveFile()
    {
      try
      {
        // Get the ProgramData folder path
        string programDataPath = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);

        // Create MyServer subfolder path
        string myServerPath = Path.Combine(programDataPath, "MyServices");

        // Create the directory if it doesn't exist
        if (!Directory.Exists(myServerPath))
        {
          Directory.CreateDirectory(myServerPath);
          Console.WriteLine($"Created directory: {myServerPath}");
        }
        else
        {
          Console.WriteLine($"Directory already exists: {myServerPath}");
        }

        // Create the readme.txt file path
        string readmeFilePath = Path.Combine(myServerPath, "readme.txt");

        // Content for the readme file
        string readmeContent = @"MyServer Application
====================

This is the MyServer application data folder.
Created on: " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + @"

This folder contains:
- Configuration files
- Log files
- Application data

For support, contact: admin@myserver.com
";

        // Write the file
        File.WriteAllText(readmeFilePath, readmeContent);
        Console.WriteLine($"Created file: {readmeFilePath}");

        // Verify the file was created and show its content
        if (File.Exists(readmeFilePath))
        {
          Console.WriteLine("\nFile content:");
          Console.WriteLine(File.ReadAllText(readmeFilePath));
        }
      }
      catch (UnauthorizedAccessException ex)
      {
        Console.WriteLine($"Access denied: {ex.Message}");
        Console.WriteLine("Try running as Administrator.");
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error: {ex.Message}");
      }
    }
  }
}
