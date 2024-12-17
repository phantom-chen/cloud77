using System;
using System.Collections.Generic;
using System.Text;

namespace Cooler.Client
{ 
    public interface IFluidPropertyProvider
    {
        string CalculateMolarMass(string fluid, double temperature);
        string CalculateDentisy(string fluid, double temperature);
        string CalculateViscosity(string fluid, double temperature);
    }
}
