namespace MPP.Models
{
    public class ConfirmationCode
    {
        public virtual int? Id { get; set; }

        public virtual int? UserId { get; set; }
        public virtual User User { get; set; } = null!;

        public virtual string? Code { get; set; }
        public virtual DateTime? Expiration { get; set; }
        public virtual bool Used { get; set; }
    }
}
