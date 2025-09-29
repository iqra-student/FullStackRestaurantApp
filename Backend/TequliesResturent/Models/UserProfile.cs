namespace TequliesResturent.Models
{
    public class UserProfile
    {
        public int UserProfileId { get; set; }
        public string UserId { get; set; } // Foreign key to ApplicationUser
        public string FullName { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation property
        public ApplicationUser User { get; set; }
        public List<Order> Orders { get; set; }
    }
}
