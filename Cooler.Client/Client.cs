using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Cooler.Client
{
    public class CoolerClientOptions
    {
        public bool Online { get; set; } = false;

        /// <summary>
        /// Product version
        /// Example: 1.0.0
        /// </summary>
        public string Version { get; set; }

        /// <summary>
        /// Application startup location.
        /// Example: C:\Users\xxx\AppData\Local\Cooler
        /// </summary>
        public string StartupPath { get; set; }

        /// <summary>
        /// User data folder location
        /// Example: C:\Users\xxx\Documents\Cooler
        /// </summary>
        public string UserDataPath { get; set; }

        /// <summary>
        /// Example: https://xxx/resources/releases/cooler
        /// </summary>
        public string UpdateEndpoint { get; set; }
    }

    public interface ICoolerClient
    {
        void Hello();
        IUserDataProvider UserData { get; set; }
    }

    public class CoolerClient : ICoolerClient
    {
        public static CoolerClientOptions Options;

        public IUserDataProvider UserData { get; set; }

        public void Hello() { }

        public string ReadFromBase64(string code)
        {
            MemoryStream steam = new MemoryStream(Convert.FromBase64String(code));
            StreamReader reader = new StreamReader(steam);
            string newCode = reader.ReadToEnd();
            return newCode;
        }

        public string WriteToBase64(string code)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(code));
        }

        public string Encrypt(string key, string iv, string originalString)
        {
            var _key = ASCIIEncoding.ASCII.GetBytes(key);
            var _iv = ASCIIEncoding.ASCII.GetBytes(iv);

            if (String.IsNullOrEmpty(originalString))
            {
                throw new ArgumentNullException
                       ("The string which needs to be encrypted can not be null.");
            }
            DESCryptoServiceProvider cryptoProvider = new DESCryptoServiceProvider();
            MemoryStream memoryStream = new MemoryStream();
            CryptoStream cryptoStream = new CryptoStream(memoryStream,
                cryptoProvider.CreateEncryptor(_key, _iv), CryptoStreamMode.Write);
            StreamWriter writer = new StreamWriter(cryptoStream);
            writer.Write(originalString);
            writer.Flush();
            cryptoStream.FlushFinalBlock();
            writer.Flush();
            return Convert.ToBase64String(memoryStream.GetBuffer(), 0, (int)memoryStream.Length);
        }

        public string Decrypt(string key, string iv, string cryptedString)
        {
            var _key = ASCIIEncoding.ASCII.GetBytes(key);
            var _iv = ASCIIEncoding.ASCII.GetBytes(iv);

            if (String.IsNullOrEmpty(cryptedString))
            {
                throw new ArgumentNullException
                   ("The string which needs to be decrypted can not be null.");
            }
            DESCryptoServiceProvider cryptoProvider = new DESCryptoServiceProvider();
            MemoryStream memoryStream = new MemoryStream
                    (Convert.FromBase64String(cryptedString));
            CryptoStream cryptoStream = new CryptoStream(memoryStream,
                cryptoProvider.CreateDecryptor(_key, _iv), CryptoStreamMode.Read);
            StreamReader reader = new StreamReader(cryptoStream);
            return reader.ReadToEnd();
        }
    }

    public class UserSettings
    {
        public string Email { get; set; }
        public string Key { get; set; }
        public string Token { get; set; }
        public bool SavePassword { get; set; }
        public bool AutoLogin { get; set; }
        public string Theme { get; set; }
        public string Language { get; set; }
        public string Currency { get; set; }
        public string Unit { get; set; }
        public bool EnableThousandSeporator { get; set; }
    }

    public class WorkItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class ResultItem
    {
        public string Name { get; set; }
        public string Result { get; set; }
    }

    public class Book
    {
        public string Name { get; set; }
        public string Author { get; set; }
    }

    public class CaseASolution
    {
        public string Result1 { get; set; }
        public string Result2 { get; set; }
        public string Result3 { get; set; }
        public string Result4 { get; set; }
    }
}
