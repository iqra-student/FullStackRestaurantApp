using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TequliesResturent.Data;
using TequliesResturent.Models;

namespace TequliesResturent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly Repository<Product> products;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
            this.products = new Repository<Product>(context);
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            return Ok(await products.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var options = new QueryOptions<Product>
            {
                Includes = "ProductIngredients.Ingredient"
            };
            var product = await products.GetByIdAsync(id, options);

            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        // ✅ New endpoint to assign ingredients to a product
        [HttpPost("{productId}/AssignIngredients")]
        public async Task<IActionResult> AssignIngredients(int productId, [FromBody] List<int> ingredientIds)
        {
            var product = await _context.Products
                .Include(p => p.ProductIngredients)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
                return NotFound("Product not found");

            foreach (var ingId in ingredientIds)
            {
                // check if already exists
                if (!product.ProductIngredients.Any(pi => pi.IngredientId == ingId))
                {
                    product.ProductIngredients.Add(new ProductIngredient
                    {
                        ProductId = productId,
                        IngredientId = ingId
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Ingredients assigned successfully" });
        }
    }
}
