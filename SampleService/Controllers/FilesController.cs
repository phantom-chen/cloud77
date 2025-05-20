using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SampleService.Models;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class FilesController : ControllerBase
  {
    [HttpGet]
    public IActionResult Get()
    {
      return Ok(new LocalDataModel().GetFiles());
    }

    [HttpPost("")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
      if (file == null || file.Length == 0)
      {
        return BadRequest("No file uploaded.");
      }

      var filePath = new LocalDataModel().GetFilePath(file.FileName);

      using (var stream = new FileStream(filePath, FileMode.Create))
      {
        await file.CopyToAsync(stream);
      }

      return Ok(new { FilePath = filePath });
    }

    [HttpGet("{fileName}")]
    public IActionResult DownloadFile(string fileName)
    {
      var filePath = new LocalDataModel().GetFilePath(fileName);

      if (!System.IO.File.Exists(filePath))
      {
        return NotFound("File not found.");
      }

      var fileBytes = System.IO.File.ReadAllBytes(filePath);
      var contentType = "application/octet-stream";
      var fileDownloadName = Path.GetFileName(filePath);

      return File(fileBytes, contentType, fileDownloadName);
    }

    [HttpDelete("{fileName}")]
    public IActionResult Delete(string fileName)
    {
      new LocalDataModel().DeleteFile(fileName);
      return Ok();
    }
  }
}
