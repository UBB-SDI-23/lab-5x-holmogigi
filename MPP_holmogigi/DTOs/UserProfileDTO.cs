using MPP.Models;

namespace MPP.DTOs
{
    public class UserProfileDTO
    {
        public virtual long Id { get; set; }
        public virtual string? Name { get; set; }
        public virtual string? Password { get; set; }

        public virtual UserProfile UserProfile { get; set; } = null!;

        public virtual int BodybuildersCount { get; set; }
        public virtual int CoachesCount { get; set; }
        public virtual int GymsCount { get; set; }
        public virtual int ContestsCount { get; set; }
    }
}
