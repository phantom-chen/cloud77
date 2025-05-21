using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GatewayService.Filters
{
  public class EmailFilter : ActionFilterAttribute
  {
    public override void OnActionExecuting(ActionExecutingContext actionContext)
    {
      base.OnActionExecuting(actionContext);
      string email = actionContext.HttpContext.Request.Query["email"];

      if (string.IsNullOrWhiteSpace(email))
      {
        actionContext.Result = new BadRequestResult();
        //actionContext.Result = new JsonResult("invalid request");      
      }
    }
  }

  public class RequiredQueryAttribute : ActionFilterAttribute
  {
    public string[] Params { get; set; }

    public override void OnActionExecuting(ActionExecutingContext actionContext)
    {
      base.OnActionExecuting(actionContext);

      if (Params.Length != 0)
      {
        int i = 0;
        bool validated = true;
        while (validated && i < Params.Length)
        {
          string param = actionContext.HttpContext.Request.Query[Params[i]];
          validated = !string.IsNullOrEmpty(param);
          i++;
        }

        if (!validated) actionContext.Result = new BadRequestResult();
      }

    }
  }
}
