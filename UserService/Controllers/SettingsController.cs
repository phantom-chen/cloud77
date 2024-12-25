using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace UserService.Controllers
{
    /// <summary>
    /// Help manage service settings.
    /// It can only be accessible for admin users.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SettingsController : ControllerBase
    {
    }
}
