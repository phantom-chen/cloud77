using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooler.Client.Providers
{
    internal class Engine
    {
    }

    /// <summary>
    /// Demo that return x + 10
    /// </summary>
    public class EngineA : IEngineProvider
    {
        public int Calculate(int x)
        {
            return x + 10;
        }
    }

    /// <summary>
    /// Demo that return x * x + 10
    /// </summary>
    public class EngineB : IEngineProvider
    {
        public int Calculate(int x)
        {
            return x * x + 10;
        }
    }

    /// <summary>
    /// Demo that return square of x
    /// </summary>
    public class EngineC : IEngineProvider
    {
        public int Calculate(int x)
        {
            return Convert.ToInt32(Math.Sqrt(x));
        }
    }
}
