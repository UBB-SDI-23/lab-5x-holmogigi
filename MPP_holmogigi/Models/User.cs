using Microsoft.VisualBasic;

namespace MPP.Models
{
    public class User
    {
        public virtual int Id { get; set; }
        public virtual string? Name { get; set; }
        public virtual string? Password { get; set; }

 
        public virtual int AccessLevel { get; set; }
        public virtual UserProfile UserProfile { get; set; } = null!;
    }
}