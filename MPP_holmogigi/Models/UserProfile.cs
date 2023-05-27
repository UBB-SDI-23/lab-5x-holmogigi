using Microsoft.AspNetCore.Components.Web.Virtualization;
using static Bogus.DataSets.Name;

namespace MPP.Models
{
   
    public class UserProfile
    {
        public virtual int Id { get; set; }

        public virtual int? UserId { get; set; }
        public virtual User User { get; set; } = null!;

        public virtual string? Bio { get; set; }
        public virtual string? Location { get; set; }

        public virtual DateTime? Birthday { get; set; }
        public virtual string? Gender { get; set; }
        public virtual string? MaritalStatus { get; set; }

        public virtual int PagePreference { get; set; }
    }
}