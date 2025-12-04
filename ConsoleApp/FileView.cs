using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp
{
    internal class FileView
    {
        public string[] ListFiles(string root)
        {
            var results = new List<string>();
            var path = root;
            if (Directory.Exists(path))
            {
                var dirs = getDirs(path);
                if (dirs != null)
                {
                    var a = dirs.Distinct();
                    results.AddRange(a);
                }
            }

            return results.Distinct().ToArray();
        }

        private bool isSkip(string path)
        {
            return path.EndsWith("\\Debug") ||
                   path.EndsWith("\\Release") ||
                   path.EndsWith("\\obj") ||
                   path.EndsWith("\\packages") ||
                   path.EndsWith("\\.angular") ||
                   path.EndsWith("\\.scannerwork") ||
                   path.Contains("\\_") ||
                   path.EndsWith("\\node_modules") ||
                   path.EndsWith("\\dist") ||
                   path.EndsWith("\\wwwroot") ||
                   path.EndsWith("\\TestResults") ||
                   path.EndsWith("\\build") ||
                   path.EndsWith("\\coverage");
        }

        private string[] getDirs(string d)
        {
            if (Directory.Exists(d))
            {
                if (isSkip(d))
                {
                    return new string[] { d };
                }

                var dirs = Directory.GetDirectories(d);
                if (dirs.Length > 0)
                {
                    var l = new List<string>();
                    foreach (var dir in dirs)
                    {
                        l.Add(dir);
                        var t = getDirs(dir);
                        if (t != null && t.Length > 0)
                        {
                            l.AddRange(getDirs(dir));
                        }
                    }
                    return l.ToArray();
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
    }
}
