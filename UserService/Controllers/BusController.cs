using MassTransit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusController : ControllerBase
    {
        private readonly IBus bus;

        public BusController(
            IBus bus
            )
        {
            this.bus = bus;
        }

        [HttpPost]
        [Route("messages")]
        public IActionResult Post()
        {
            bus.Publish(new Cloud77.Service.Bus.SimpleMessage() { Content = "invoke via bus controller", Id = "bus" });
            return Ok(new
            {
                message = "controller works"
            });
        }
    }
}
