using System;
using System.Collections.Generic;
using System.Text;

namespace Cooler.Client
{
    public interface IEngineProvider
    {
        int Calculate(int x);
    }

    public enum CalculationMode
    {
        Design,
        Rating,
        Performance
    }

    public enum FlowType
    {
        CounterCurrent,
        CoCurrent
    }
}
