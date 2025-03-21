namespace ConsoleApp
{
  internal class Program
  {
    static void Main(string[] args)
    {
      Console.WriteLine("Hello, World!");
      Console.WriteLine("Please press your input: ");
      var line = Console.ReadLine();
      Console.WriteLine("Your input is " + line);
      Console.WriteLine("Press any key to exit");
      Console.ReadKey();
    }
  }
}
