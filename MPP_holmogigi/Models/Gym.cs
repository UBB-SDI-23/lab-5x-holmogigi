namespace MPP.Models
{
    public class Gym
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Location { get; set; }
        public int Memembership { get; set; }   
        public int Grade { get; set; }

        public virtual ICollection<Coach> Coaches { get; set; } = null!;

        public virtual int? UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }
}
