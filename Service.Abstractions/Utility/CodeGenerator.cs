using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Cloud77.Abstractions.Utility
{
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
}
