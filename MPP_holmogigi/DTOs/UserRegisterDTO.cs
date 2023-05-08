using static Bogus.DataSets.Name;

namespace MPP.DTOs
{
    public class UserRegisterDTO
    {
        public virtual string? Name { get; set; }
        public virtual string? Password { get; set; }

        public virtual string? Bio { get; set; }
        public virtual string? Location { get; set; }

        public virtual DateTime? Birthday { get; set; }
        public virtual string? Gender { get; set; }
        public virtual string? MaritalStatus { get; set; }
    }
}
