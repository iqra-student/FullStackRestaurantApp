using System.ComponentModel.DataAnnotations;

namespace TequliesResturent.DTOs.IngredientDTOs
{
    public class IngredientCreateRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
    }

}
