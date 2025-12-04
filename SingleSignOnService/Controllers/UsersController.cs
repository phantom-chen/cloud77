using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SingleSignOnService.Models;

namespace SingleSignOnService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> signInManager;

        public UsersController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        private IActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null) return StatusCode(500);

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                }

                if (ModelState.IsValid)
                {
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var user = userManager.Users.FirstOrDefault();
            return Ok(new
            {
                Email = user.Email
            });
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RegisterModel body)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(this.ModelState);
            }

            var user = new IdentityUser()
            {
                UserName = body.UserName,
                Email = body.Email,
            };

            var result = await this.userManager.CreateAsync(user, body.Password);
            IActionResult errorResult = GetErrorResult(result);
            if (errorResult != null) return errorResult;
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "Creating user failed!"});
            }

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] RegisterModel body)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(this.ModelState);
            }
            var result = await this.signInManager.PasswordSignInAsync(body.UserName, body.Password, false, false);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "Login failed!" });
            }
            return Ok();
        }

        [HttpGet("session")]
        public IActionResult Session()
        {
            if (User?.Identity?.IsAuthenticated ?? false)
            {
                var claims = User.Claims;
                var a = User.HasClaim("name", "your_name");
                return Ok(new { Message = "User is authenticated.", Name = User.Identity.Name });
            }
            else
            {
                return Unauthorized(new { Message = "User is not authenticated." });
            }
        }


        [HttpDelete]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            await this.signInManager.SignOutAsync();
            return Ok(new { Message = "Logout successfully!" });
        }

        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword()
        {
            if (!ModelState.IsValid)
            {
                return new UnprocessableEntityObjectResult(ModelState);
            }

            var user = userManager.Users.FirstOrDefault();

            //var token = await userManager.GeneratePasswordResetTokenAsync(user);
            //await userManager.ResetPasswordAsync(user, token, "NewPassword1!");

            //var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            //await userManager.ConfirmEmailAsync(user, token);

            return Ok();
        }

        [HttpDelete("{email}")]
        public IActionResult Delete(string email)
        {
            if (!ModelState.IsValid)
            {
                return new UnprocessableEntityObjectResult(ModelState);
            }
            return Ok();
        }
    }
}
