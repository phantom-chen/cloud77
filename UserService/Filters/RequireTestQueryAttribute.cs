using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace UserService.Filters
{
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
