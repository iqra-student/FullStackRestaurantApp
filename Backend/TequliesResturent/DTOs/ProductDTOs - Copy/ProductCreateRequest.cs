namespace TequliesResturent.DTOs.ProductDTOs
{
    public class ProductCreateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public int[]? IngredientIds { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}
