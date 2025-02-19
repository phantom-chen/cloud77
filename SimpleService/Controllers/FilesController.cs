using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SimpleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class FilesController : ControllerBase
  {
    private readonly string _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

    public FilesController()
    {
      if (!Directory.Exists(_storagePath))
      {
        Directory.CreateDirectory(_storagePath);
      }
    }

    [HttpGet]
    public IActionResult Get()
    {
      return Ok("wip");
    }

    [HttpPost("")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
      if (file == null || file.Length == 0)
      {
        return BadRequest("No file uploaded.");
      }

      var filePath = Path.Combine(_storagePath, file.FileName);

      using (var stream = new FileStream(filePath, FileMode.Create))
      {
        await file.CopyToAsync(stream);
      }

      return Ok(new { FilePath = filePath });
    }

    [HttpGet("{fileName}")]
    public IActionResult DownloadFile(string fileName)
    {
      var filePath = Path.Combine(_storagePath, fileName);

      if (!System.IO.File.Exists(filePath))
      {
        return NotFound("File not found.");
      }

      var fileBytes = System.IO.File.ReadAllBytes(filePath);
      var contentType = "application/octet-stream";
      var fileDownloadName = Path.GetFileName(filePath);

      return File(fileBytes, contentType, fileDownloadName);
    }
  }
}
