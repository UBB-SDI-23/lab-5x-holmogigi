using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using MPP.Models;
using System.Security.Claims;

namespace MPP
{
    public class RoleAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private readonly AccessLevel _requiredAccessLevel;

        public RoleAttribute(AccessLevel requiredAccessLevel)
        {
            _requiredAccessLevel = requiredAccessLevel;
        }
  
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (user == null || user.Identity == null || !user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var accessLevelClaim = user.FindFirst(ClaimTypes.Role);
            if (accessLevelClaim == null || !Enum.TryParse<AccessLevel>(accessLevelClaim.Value, out var userAccessLevel) || userAccessLevel < _requiredAccessLevel)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
