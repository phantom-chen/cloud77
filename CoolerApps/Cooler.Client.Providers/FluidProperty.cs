using EngineeringUnits;
using SharpFluids;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooler.Client.Providers
{
    internal class FluidProperty
    {
    }

    /// <summary>
    /// Use Sharp Fluids
    /// </summary>
    public class FluidPropertyCalculator : IFluidPropertyProvider
    {
        //FluidList.Ethylene
        public string CalculateDentisy(string fluid, double temperature)
        {
            Fluid R717 = new Fluid(FluidList.Ammonia);
            R717.UpdatePT(Pressure.FromBars(10), Temperature.FromDegreesCelsius(100));

            return R717.Density.ToString();
            //Console.WriteLine(R717.Density); // 5.751 kg/m³
        }

        public string CalculateMolarMass(string fluid, double temperature)
        {
            temperature = temperature + 273.15;
            Fluid Water = new Fluid(FluidList.Water);
            Water.UpdatePT(Pressure.FromPascal(101325), Temperature.FromKelvins(temperature));
            return Water.MolarMass.Value.ToString();  // 18 kg/mol
        }

        public string CalculateViscosity(string fluid, double temperature)
        {
            Fluid R717 = new Fluid(FluidList.Ammonia);
            R717.UpdatePT(Pressure.FromBars(10), Temperature.FromDegreesCelsius(100));

            return R717.DynamicViscosity.ToString();
            //Console.WriteLine(R717.DynamicViscosity); // 1.286e-05 Pa·s
        }
    }
}
