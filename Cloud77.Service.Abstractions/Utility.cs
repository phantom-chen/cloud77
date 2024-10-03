using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading;

namespace Cloud77.Service
{
    public class BaseQuery
    {
        public int Index { get; set; } = 0;
        public int Size { get; set; } = 10;
        public string Sort { get; set; } = "desc";
    }

    public class EmptyEmail : ServiceResponse
    {
        public EmptyEmail()
        {
            Code = "empty-email";
            Message = "empty user email";
        }
    }

    public class EmptyClient : ServiceResponse
    {
        public EmptyClient()
        {
            Code = "empty-client-entity";
            Message = "empty user client";
        }
    }

    public class EmptyLicense : ServiceResponse
    {
        public EmptyLicense()
        {
            Code = "empty-license";
            Message = "empty user license";
        }
    }

    public class EmptyDevices : ServiceResponse
    {
        public EmptyDevices()
        {
            Code = "empty-device";
            Message = "empty user device";
        }
    }

    public class CodeGenerator
    {
        public static string HashString(string content)
        {
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] bytes_md5_in = Encoding.UTF8.GetBytes(content);
            byte[] bytes_md5_out = md5.ComputeHash(bytes_md5_in);
            string str_md5_out = BitConverter.ToString(bytes_md5_out);
            return str_md5_out.Replace("-", "");
        }

        public static string GenerateDigitalCode(int size)
        {
            var random = new Random();
            var code = "";
            for (int i = 0; i < size; i++)
            {
                code = code + random.Next(0, 10).ToString();
            }
            return code;
        }

        private static readonly string characters = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

        public static string GenerateCode(int size)
        {
            var length = characters.Length;
            var random = new Random();
            var code = "";
            for (int i = 0; i < size; i++)
            {
                code = code + characters.Substring(random.Next(0, length), 1);
            }
            return code;
        }

        public static string Encrypt(byte[] des_key, byte[] des_iv, string originalString)
        {
            if (string.IsNullOrEmpty(originalString))
            {
                throw new ArgumentNullException
                       ("The string which needs to be encrypted can not be null.");
            }
            DESCryptoServiceProvider cryptoProvider = new DESCryptoServiceProvider();
            MemoryStream memoryStream = new MemoryStream();
            CryptoStream cryptoStream = new CryptoStream(memoryStream,
                cryptoProvider.CreateEncryptor(des_key, des_iv), CryptoStreamMode.Write);
            StreamWriter writer = new StreamWriter(cryptoStream);
            writer.Write(originalString);
            writer.Flush();
            cryptoStream.FlushFinalBlock();
            writer.Flush();
            return Convert.ToBase64String(memoryStream.GetBuffer(), 0, (int)memoryStream.Length);
        }

        public static string Decrypt(byte[] des_key, byte[] des_iv, string cryptedString)
        {
            if (string.IsNullOrEmpty(cryptedString))
            {
                throw new ArgumentNullException
                   ("The string which needs to be decrypted can not be null.");
            }
            DESCryptoServiceProvider cryptoProvider = new DESCryptoServiceProvider();
            MemoryStream memoryStream = new MemoryStream
                    (Convert.FromBase64String(cryptedString));
            CryptoStream cryptoStream = new CryptoStream(memoryStream,
                cryptoProvider.CreateDecryptor(des_key, des_iv), CryptoStreamMode.Read);
            StreamReader reader = new StreamReader(cryptoStream);
            return reader.ReadToEnd();
        }
    }

    public class TimerManager
    {
        private Timer timer;

        public DateTime TimerStarted { get; private set; }

        public bool IsTimerStarted { get; private set; }

        public void StartTimer(Action action1, Action action2)
        {
            execute = action1;
            executeForExpired = action2;
            TimerStarted = DateTime.Now;
            IsTimerStarted = true;
            var reset = new AutoResetEvent(false);
            timer = new Timer(Execute, reset, 1000, 2000);
        }

        public void StopTimer()
        {
            IsTimerStarted = false;
        }

        private Action execute;

        private Action executeForExpired;

        private void Execute(object state)
        {
            if (IsTimerStarted)
            {
                execute();

                var expired = (DateTime.Now - TimerStarted).TotalSeconds > 60;
                if (expired)
                {
                    IsTimerStarted = false;
                    executeForExpired();
                    timer.Dispose();
                }
            }
        }
    }

    public class Cloud77Utility
    {
        public static string DatabaseName { get; set; } = "";
        public static string Users { get; set; } = "Users";
        public static string Events { get; set; } = "Events";
        public static string Tasks { get; set; } = "Tasks";
        public static string Authors { get; set; } = "Authors";
        public static string Settings { get; set; } = "Settings";
    }
}
