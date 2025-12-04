using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp
{
    internal class FileDownload
    {
        private int progress = -1;

        private void DownloadProgressChangedHandler(object sender, DownloadProgressChangedEventArgs e)
        {
            if (e.ProgressPercentage > progress)
            {
                progress = e.ProgressPercentage;
                Console.WriteLine($"{e.ProgressPercentage} %");
            }
        }

        private void DownloadFileCompletedHandler(object sender, AsyncCompletedEventArgs e)
        {
            Console.WriteLine("done!");
        }

        public void GetFile(string url, string path)
        {
            if (File.Exists(path))
            {
                File.Delete(path);
            }

            WebClient client = new WebClient();
            client.DownloadProgressChanged += DownloadProgressChangedHandler;
            client.DownloadFileCompleted += DownloadFileCompletedHandler;
            client.DownloadFileAsync(new Uri(url), path);

            Console.WriteLine("downloading at background now");
            if (File.Exists(path))
            {
                ZipFile.ExtractToDirectory(path, "./");
            }
        }

        /// <summary>
        /// Use http web request.
        /// </summary>
        /// <param name="URL"></param>
        /// <param name="filename"></param>
        /// <returns></returns>
        private bool DownloadFile(string URL, string filename)
        {
            try
            {
                HttpWebRequest Myrq = (HttpWebRequest)HttpWebRequest.Create(URL);
                HttpWebResponse myrp = (HttpWebResponse)Myrq.GetResponse();
                Stream st = myrp.GetResponseStream();
                Stream so = new FileStream(filename, FileMode.Create);
                byte[] by = new byte[1024];
                int osize = st.Read(by, 0, (int)by.Length);
                while (osize > 0)
                {
                    so.Write(by, 0, osize);
                    osize = st.Read(by, 0, (int)by.Length);
                }
                so.Close();
                st.Close();
                myrp.Close();
                Myrq.Abort();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
