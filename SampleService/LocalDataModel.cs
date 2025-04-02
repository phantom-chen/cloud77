using System.Reflection;

namespace SampleService
{
  public class LocalDataModel
  {
    public LocalDataModel()
    {
      string assemblyLocation = Assembly.GetExecutingAssembly().Location;
      root = Path.GetDirectoryName(assemblyLocation);

      root = Path.Combine(root, "data");
      if (!Directory.Exists(root))
      {
        Directory.CreateDirectory(root);
      }

      UploadFolder = Path.Combine(root, "uploads");
      if (!Directory.Exists(UploadFolder))
      {
        Directory.CreateDirectory(UploadFolder);
      }

      PostFolder = Path.Combine(root, "posts");
      if (!Directory.Exists(PostFolder))
      {
        Directory.CreateDirectory(PostFolder);
      }
    }

    private string root = "";

    public readonly string UploadFolder = "";

    public readonly string PostFolder = "";

    public string GetFilePath(string name)
    {
      return Path.Combine(UploadFolder, name);
    }

    public string[] GetFiles()
    {
      string[] files = Directory.GetFiles(UploadFolder).Select(f => Path.GetFileName(f)).ToArray();
      return files;
    }

    public bool DeleteFile(string name)
    {
      var filePath = Path.Combine(UploadFolder, name);
      if (File.Exists(filePath))
      {
        File.Delete(filePath);
        return true;
      }
      return false;
    }

    public string[] GetPosts()
    {
      string[] txtFiles = Directory.GetFiles(PostFolder, "*.md");
      return txtFiles.Select(f => Path.GetFileNameWithoutExtension(f)).ToArray();
    }

    public bool PostIsExisting(string name)
    {
      return File.Exists(Path.Combine(PostFolder, name + ".md"));
    }

    public string GetPost(string name)
    {
      var filePath = Path.Combine(PostFolder, name + ".md");
      return File.ReadAllText(filePath);
    }

    public string SavePost(string name, string content)
    {
      var filePath = Path.Combine(PostFolder, name + ".md");
      File.WriteAllText(filePath, content);
      return filePath;
    }

    public void DeletePost(string name)
    {
      var filePath = Path.Combine(PostFolder, name + ".md");
      File.Delete(filePath);
    }
  }
}
