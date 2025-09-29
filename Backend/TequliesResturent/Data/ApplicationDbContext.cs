using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TequliesResturent.Models;

namespace TequliesResturent.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<ProductIngredient> ProductIngredients { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure many-to-many relationship between Product and Ingredient
            modelBuilder.Entity<ProductIngredient>()
                .HasKey(pi => new { pi.ProductId, pi.IngredientId });
            modelBuilder.Entity<ProductIngredient>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.ProductIngredients)
                .HasForeignKey(pi => pi.ProductId);
            modelBuilder.Entity<ProductIngredient>()
                .HasOne(pi => pi.Ingredient)
                .WithMany(i => i.ProductIngredients)
                .HasForeignKey(pi => pi.IngredientId);


            // Seeding Categories
            modelBuilder.Entity<Category>().HasData(
      new Category { CategoryId = 1, Name = "Veg", Description = "Delicious vegetarian meals" },
      new Category { CategoryId = 2, Name = "Non-Veg", Description = "Tasty non-vegetarian dishes" },
      new Category { CategoryId = 3, Name = "Fast Food", Description = "Quick and satisfying fast food items" },
      new Category { CategoryId = 4, Name = "Beverages", Description = "Cold drinks, juices, and more" },
      new Category { CategoryId = 5, Name = "Desserts", Description = "Sweet treats to finish your meal" }
  );



            // Seeding Ingredients
            modelBuilder.Entity<Ingredient>().HasData(
                new Ingredient { IngredientId = 1, Name = "Mozzarella Cheese", Description = "Creamy and melty cheese" },
                new Ingredient { IngredientId = 2, Name = "Tomato Sauce", Description = "Rich and tangy sauce" },
                new Ingredient { IngredientId = 3, Name = "Beef Patty", Description = "Grilled ground beef" },
                new Ingredient { IngredientId = 4, Name = "Lettuce", Description = "Fresh green lettuce" },
                new Ingredient { IngredientId = 5, Name = "French Fries", Description = "Crispy potato fries" }
            );

            // Seeding Products
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    ProductId = 1,
                    Name = "Classic Cheese Pizza",
                    Description = "Cheesy goodness with tomato base",
                    Price = 9.99m,
                    Stock = 20,
                    CategoryId = 1
                },
                new Product
                {
                    ProductId = 2,
                    Name = "Double Beef Burger",
                    Description = "Two juicy patties with cheese",
                    Price = 11.99m,
                    Stock = 15,
                    CategoryId = 2
                },
                new Product
                {
                    ProductId = 3,
                    Name = "Coca Cola",
                    Description = "Chilled fizzy drink",
                    Price = 1.99m,
                    Stock = 50,
                    CategoryId = 3
                },
                new Product
                {
                    ProductId = 4,
                    Name = "Chocolate Cake",
                    Description = "Rich and moist cake slice",
                    Price = 4.99m,
                    Stock = 10,
                    CategoryId = 4
                },
                new Product
                {
                    ProductId = 5,
                    Name = "Loaded Fries",
                    Description = "Fries topped with cheese and jalapenos",
                    Price = 5.49m,
                    Stock = 25,
                    CategoryId = 5
                }
            );


            // Seeding ProductIngredient (many-to-many)
            modelBuilder.Entity<ProductIngredient>().HasData(
                // Product 1: Classic Cheese Pizza
                new ProductIngredient { ProductId = 1, IngredientId = 1 }, // Mozzarella Cheese
                new ProductIngredient { ProductId = 1, IngredientId = 2 }, // Tomato Sauce
                new ProductIngredient { ProductId = 1, IngredientId = 4 }, // Lettuce

                // Product 2: Double Beef Burger
                new ProductIngredient { ProductId = 2, IngredientId = 3 }, // Beef Patty
                new ProductIngredient { ProductId = 2, IngredientId = 2 }, // Tomato Sauce
                new ProductIngredient { ProductId = 2, IngredientId = 4 }  // Lettuce
            );

        }
    }
}
