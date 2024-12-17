using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooler.Client.Providers
{
    public class CustomerProvider : ICustomerProvider
    {
        public CustomerProvider(string userData)
        {
            this.root = Path.Combine(userData, "customers");
            if (!Directory.Exists(root))
            {
                Directory.CreateDirectory(root);
            }
        }

        public Customer SelectedCustomer { get; private set; }

        int selectedIndex = -1;

        public int SelectedIndex
        {
            get { return selectedIndex; }
            set
            {
                selectedIndex = value;

                if (Customers != null && Customers.Any())
                {
                    if (selectedIndex < 0 || selectedIndex > Customers.Count - 1)
                    {
                        SelectedCustomer = null;
                    }
                    else
                    {
                        SelectedCustomer = Customers[selectedIndex];
                    }
                }
                else
                {
                    SelectedCustomer = null;
                }
            }
        }

        private IEnumerable<string> GetAllFiles(DirectoryInfo directory)
        {
            var paths = new List<string>();
            var files = directory.GetFiles("*.json");
            if (files.Length > 0)
            {
                paths.AddRange(files.Select(f => f.FullName));
            }

            var dirs = directory.GetDirectories();
            if (dirs.Length > 0)
            {
                foreach (var d in dirs)
                {
                    var f = GetAllFiles(d);
                    if (f.Count() > 0)
                    {
                        paths.AddRange(f);
                    }
                }
            }

            return paths;
        }

        private IEnumerable<string> GetAllFiles()
        {
            return GetAllFiles(new DirectoryInfo(root));
        }

        private List<Customer> ReadData()
        {
            var paths = GetAllFiles();
            var data = new List<Customer>();

            if (paths.Any())
            {
                data.AddRange(
                    paths.Select(p =>
                    {
                        var str = File.ReadAllText(p);
                        return JsonConvert.DeserializeObject<Customer>(str);
                    }));
            }
            return data;
        }

        private readonly string root;

        public List<Customer> Customers
        {
            get
            {
                return ReadData();
            }
        }

        public bool CustomerIsExisting(string guid)
        {
            var path = Path.Combine(root, $"{guid}.json");
            return File.Exists(path);
        }

        private bool AddCustomer(Customer customer)
        {
            if (string.IsNullOrEmpty(customer.Guid)) return false;
            if (CustomerIsExisting(customer.Guid)) return false;
            if (CustomerCount == 0)
            {
                customer.Index = 1;
            }
            else
            {
                var index = Customers.OrderByDescending(c => c.Index).FirstOrDefault().Index;
                customer.Index = index + 1;
            }

            var str = JsonConvert.SerializeObject(customer);
            File.WriteAllText(Path.Combine(root, $"{customer.Guid}.json"), str);

            return true;
        }

        public Customer GetCustomer(string guid)
        {
            var path = Path.Combine(root, $"{guid}.json");
            if (!File.Exists(path))
            {
                return null;
            }
            var content = File.ReadAllText(path);
            return JsonConvert.DeserializeObject<Customer>(content);
        }

        public bool UpdateCustomer(Customer customer)
        {
            if (string.IsNullOrEmpty(customer.Guid)) return false;
            if (!CustomerIsExisting(customer.Guid))
            {
                return AddCustomer(customer);
            }
            else
            {
                var str = JsonConvert.SerializeObject(customer);
                File.WriteAllText(Path.Combine(root, $"{customer.Guid}.json"), str);
                return true;
            }
        }

        public bool DeleteCustomer(string guid)
        {
            if (string.IsNullOrEmpty(guid)) return false;
            if (!CustomerIsExisting(guid)) return false;

            File.Delete(Path.Combine(root, $"{guid}.json"));

            return true;
        }

        public int CustomerCount
        {
            get
            {
                var directory = new DirectoryInfo(root);
                return directory.GetFiles("*.json").Length;

                //var paths = new List<string>();
                //var files = directory.GetFiles();
                //if (files.Length > 0)
                //{
                //    paths.AddRange(files.Select(f => f.FullName));
                //}

                //var dirs = directory.GetDirectories();
                //if (dirs.Length > 0)
                //{
                //    foreach (var d in dirs)
                //    {
                //        var f = GetAllFiles(d);
                //        if (f.Count() > 0)
                //        {
                //            paths.AddRange(f);
                //        }
                //    }
                //}

                //return paths;
            }
        }
    }
}
