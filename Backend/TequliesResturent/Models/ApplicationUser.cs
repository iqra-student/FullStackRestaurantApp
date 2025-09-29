using Microsoft.AspNetCore.Identity;

namespace TequliesResturent.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<Order>? Orders { get; set; }
    }
}
