using System;
using System.Collections.Generic;
using System.Text;

namespace Cooler.Client
{
    public class Customer
    {
        public int Index { get; set; }
        public string Guid { get; set; } = "";
        public string Group { get; set; } = "";
        public string CustomerName { get; set; } = "";
        public string CompanyName { get; set; } = "";
        public string SurName { get; set; } = "";
        public string GivenName { get; set; } = "";
        public string Country { get; set; } = "";
        public string Email { get; set; } = "";
        public string Currency { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Discount { get; set; } = "";
        public string DeliveryTerms { get; set; } = "";
        public string PaymentTerms { get; set; } = "";
        public string DeliveryTime { get; set; } = "";
        public string QuoteValidity { get; set; } = "";
        public string CreateDate { get; set; } = "";
    }

    public interface ICustomerProvider
    {
    }
}
