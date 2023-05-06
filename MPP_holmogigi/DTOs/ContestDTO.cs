namespace MPP.DTOs
{
    public class ContestDTO
    {
        public DateTime? DateTime { get; set; }
        public string? Name { get; set; }

        public string? Location { get; set; }

        public int BodybuilderId { get; set; }

        public int CoachId { get; set; }
    }
}
