using Cooler.Client;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Grpc.Net.Client;

namespace Cooler
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            var channel = GrpcChannel.ForAddress("https://localhost:7846");
            
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Form1());
        }
    }

    public class AccessToken
    {
        public string Email { get; set; }
        public string Value { get; set; }
        public string RefreshToken { get; set; }
        public string IssueAt { get; set; }
        public int ExpireInHours { get; set; }
    }

    public class AccountProvider : IAccountProvider
    {
        private string baseUrl = "";
        public AccountProvider(
            string protocols,
            string host,
            int port)
        {
            baseUrl = $"{protocols}://{host}:{port}";
        }

        public string GetAPIKey()
        {
            string url = $"{baseUrl}/api/gateway";
            HttpWebRequest req = HttpWebRequest.Create(url) as HttpWebRequest;
            req.Timeout = 5000;
            HttpWebResponse response = null;
            string key = "";
            try
            {
                response = req.GetResponse() as HttpWebResponse;
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    StreamReader sr = new StreamReader(response.GetResponseStream());
                    string json = sr.ReadToEnd().ToString();
                    sr.Close();
                    var jo = JObject.Parse(json);
                    key = jo.GetValue("apikey").ToString();
                }
            }
            catch
            {
                key = "not get api key from service";
            }
            finally
            {
                if (response != null) response.Close();
            }
            return key;
        }

        public string GetToken(string key, string email, string password)
        {
            HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(string.Format("{0}/api/users/login?email={1}&password={2}", baseUrl, email, password));
            req.Proxy.Credentials = CredentialCache.DefaultCredentials;
            req.Method = "GET";
            req.Headers.Add("X-Api-Key", key);

            HttpWebResponse response = null;
            string token = "";
            try
            {
                response = req.GetResponse() as HttpWebResponse;
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    StreamReader sr = new StreamReader(response.GetResponseStream());
                    var json = sr.ReadToEnd().ToString();
                    sr.Close();
                    var tokenObj = Newtonsoft.Json.JsonConvert.DeserializeObject<AccessToken>(json);
                    token = tokenObj.Value;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            finally
            {
                if (response != null) response.Close();
            }

            return token;
        }

        public string GetAccount(string key, string token, string email)
        {
            string uri = $"{baseUrl}/super-app/users/accounts/{email}";
            HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(uri);
            req.Proxy.Credentials = CredentialCache.DefaultCredentials;
            req.Headers.Add("Authorization", "Bearer " + token);
            req.Headers.Add("X-Api-Key", key);
            string json = "";
            HttpWebResponse response = null;
            try
            {
                response = req.GetResponse() as HttpWebResponse;

                var aa = response.StatusCode;
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    StreamReader sr = new StreamReader(response.GetResponseStream());
                    json = sr.ReadToEnd().ToString();
                    sr.Close();
                }
            }
            catch (Exception ex)
            {

            }
            finally
            {
                if (response != null) response.Close();
            }

            return json;
        }
    }
}
