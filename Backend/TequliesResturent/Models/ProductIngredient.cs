namespace TequliesResturent.Models
{
    // Join table for many-to-many between Product and Ingredient
    public class ProductIngredient
    {
        public int ProductId { get; set; }
        public Product? Product { get; set; }

        public int IngredientId { get; set; }
        public Ingredient? Ingredient { get; set; }
    }

}