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

    public class Result1
    {
        public string R10 { get; set; }
        public string R11 { get; set; }
        public string R12 { get; set; }
        public string R13 { get; set; }
        public string R14 { get; set; }
        public string R15 { get; set; }
        public string R16 { get; set; }
        public string R17 { get; set; }
        public string R18 { get; set; }
        public string R19 { get; set; }
        public string R110 { get; set; }
    }

    public class ItemDetails
    {
        public double tinA { get; set; }
        public double toutA { get; set; }
        public double tinB { get; set; }
        public double toutB { get; set; }
        public double massA { get; set; }
        public double massB { get; set; }
        public double volA { get; set; }
        public double volB { get; set; }
        public double shearA { get; set; }
        public double shearB { get; set; }
        public double heatflux { get; set; }
        public double dpA { get; set; }
        public double dpB { get; set; }
        public double dpchA { get; set; }
        public double dpchB { get; set; }
        public double dpportA { get; set; }
        public double dpportB { get; set; }
        public double diaportA { get; set; }
        public double diaportB { get; set; }
        public double velportA { get; set; }
        public double velportB { get; set; }
        public double velchA { get; set; }
        public double velchB { get; set; }
        public double coeA { get; set; }
        public double coeB { get; set; }
        public double NTUA { get; set; }
        public double NTUB { get; set; }
        public string fluidnameA { get; set; }
        public string fluidnameB { get; set; }
        public double ReA { get; set; }
        public double ReB { get; set; }
        public double TrefA { get; set; }
        public double TrefB { get; set; }
        public double TwA { get; set; }
        public double TwB { get; set; }
        public double visA { get; set; }
        public double visB { get; set; }
        public double viswA { get; set; }
        public double viswB { get; set; }
        public double denA { get; set; }
        public double denB { get; set; }
        public double cpA { get; set; }
        public double cpB { get; set; }
        public double condA { get; set; }
        public double condB { get; set; }
    }

}
