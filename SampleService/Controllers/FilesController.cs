using Cloud77.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SampleService.Models;

namespace SampleService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly SampleDataModel model;

        public FilesController()
        {
            model = new SampleDataModel();
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(model.GetFiles());
        }

        [HttpPost("")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var filePath = model.GetFilePath(file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { FilePath = filePath });
        }

        [HttpGet("{fileName}")]
        public IActionResult DownloadFile(string fileName)
        {
            var filePath = model.GetFilePath(fileName);

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
            model.DeleteFile(fileName);
            return Ok();
        }
    }
}
