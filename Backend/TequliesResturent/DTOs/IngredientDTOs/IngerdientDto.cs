namespace TequliesResturent.DTOs.IngredientDTOs
{
    // DTO Classes for Ingredient API

    /// <summary>
    /// Basic ingredient information for list views
    /// </summary>
    public class IngredientDto
    {
        public int IngredientId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    /// <summary>
    /// Detailed ingredient information including associated products
    /// </summary>
    public class IngredientDetailDto : IngredientDto
    {
        public List<ProductDto> Products { get; set; } = new List<ProductDto>();
    }

    public class ProductUsageDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
    }



    /// <summary>
    /// Basic product information for ingredient detail views
    /// </summary>
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}
