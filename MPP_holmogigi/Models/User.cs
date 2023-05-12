using Microsoft.AspNetCore.Components.Web.Virtualization;
using Microsoft.VisualBasic;

namespace MPP.Models
{
    public enum AccessLevel
    {
        Unconfirmed,
        Regular,
        Moderator,
        Admin
    }

    public class User
    {
        public virtual int Id { get; set; }
        public virtual string? Name { get; set; }
        public virtual string? Password { get; set; }


        public virtual AccessLevel AccessLevel { get; set; }

        public virtual UserProfile UserProfile { get; set; } = null!;
    }
}