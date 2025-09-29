using System.ComponentModel.DataAnnotations;

namespace TequliesResturent.Models
{
    public class UserInfoViewModel
    {
        [Required]
        public string FullName { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        [Phone]
        public string ContactNumber { get; set; }

        [Required]
        public string PaymentMethod { get; set; }
    }
}
