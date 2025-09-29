using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TequliesResturent.Data;
using TequliesResturent.Models;
using TequliesResturent.DTOs.ProductDTOs;
namespace TequliesResturent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminProductController : ControllerBase
    {
        private Repository<Product> products;
        private Repository<Ingredient> ingredients;
        private Repository<Category> categories;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AdminProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            products = new Repository<Product>(context);
            ingredients = new Repository<Ingredient>(context);
            categories = new Repository<Category>(context);
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/AdminProduct
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
        {
            try
            {
                var allProducts = await products.GetAllAsync();
                var productDtos = allProducts.Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category?.Name ?? "Unknown"
                }).ToList();

                return Ok(productDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error retrieving products: {ex.GetBaseException().Message}" });
            }
        }

        // GET: api/AdminProduct/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDetailDto>> GetProduct(int id)
        {
            try
            {
                var product = await products.GetByIdAsync(id, new QueryOptions<Product>
                {
                    Includes = "ProductIngredients.Ingredient, Category"
                });

                if (product == null)
                {
                    return NotFound(new { message = $"Product with ID {id} not found." });
                }

                var productDetailDto = new ProductDetailDto
                {
                    ProductId = product.ProductId,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    Stock = product.Stock,
                    ImageUrl = product.ImageUrl,
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category?.Name ?? "Unknown",
                    Ingredients = product.ProductIngredients?.Select(pi => new IngredientDto
                    {
                        IngredientId = pi.Ingredient.IngredientId,
                        Name = pi.Ingredient.Name,
                        Description = pi.Ingredient.Description
                    }).ToList() ?? new List<IngredientDto>()
                };

                return Ok(productDetailDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error retrieving product: {ex.GetBaseException().Message}" });
            }
        }

        // POST: api/AdminProduct
        [HttpPost]
        public async Task<ActionResult<ProductDetailDto>> CreateProduct([FromForm] ProductCreateRequest request)
        {
            try
            {
                // Validate category
                if (request.CategoryId <= 0)
                {
                    return BadRequest(new { message = "Please provide a valid category ID." });
                }

                var categoryExists = await categories.GetByIdAsync(request.CategoryId, new QueryOptions<Category>());
                if (categoryExists == null)
                {
                    return BadRequest(new { message = "Selected category does not exist." });
                }

                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var product = new Product
                {
                    Name = request.Name,
                    Description = request.Description,
                    Price = request.Price,
                    Stock = request.Stock,
                    CategoryId = request.CategoryId,
                    ProductIngredients = new List<ProductIngredient>()
                };

                // Handle file upload
                if (request.ImageFile != null)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");

                    // Create directory if it doesn't exist
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + request.ImageFile.FileName;
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.ImageFile.CopyToAsync(fileStream);
                    }

                    product.ImageUrl = "/images/" + uniqueFileName;
                }

                // Add ingredients to the product
                if (request.IngredientIds != null && request.IngredientIds.Length > 0)
                {
                    foreach (int ingredientId in request.IngredientIds)
                    {
                        // Verify ingredient exists
                        var ingredientExists = await ingredients.GetByIdAsync(ingredientId, new QueryOptions<Ingredient>());
                        if (ingredientExists != null)
                        {
                            product.ProductIngredients.Add(new ProductIngredient
                            {
                                IngredientId = ingredientId,
                                ProductId = 0 // Will be set automatically when product is saved
                            });
                        }
                    }
                }

                await products.AddAsync(product);

                // Return the created product as DTO with its relationships
                var createdProduct = await products.GetByIdAsync(product.ProductId, new QueryOptions<Product>
                {
                    Includes = "ProductIngredients.Ingredient, Category"
                });

                var productDetailDto = new ProductDetailDto
                {
                    ProductId = createdProduct.ProductId,
                    Name = createdProduct.Name,
                    Description = createdProduct.Description,
                    Price = createdProduct.Price,
                    Stock = createdProduct.Stock,
                    ImageUrl = createdProduct.ImageUrl,
                    CategoryId = createdProduct.CategoryId,
                    CategoryName = createdProduct.Category?.Name ?? "Unknown",
                    Ingredients = createdProduct.ProductIngredients?.Select(pi => new IngredientDto
                    {
                        IngredientId = pi.Ingredient.IngredientId,
                        Name = pi.Ingredient.Name,
                        Description = pi.Ingredient.Description
                    }).ToList() ?? new List<IngredientDto>()
                };

                return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, productDetailDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error creating product: {ex.GetBaseException().Message}" });
            }
        }

        // PUT: api/AdminProduct/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDetailDto>> UpdateProduct(int id, [FromForm] ProductUpdateRequest request)
        {
            try
            {
                var existingProduct = await products.GetByIdAsync(id, new QueryOptions<Product> { Includes = "ProductIngredients" });

                if (existingProduct == null)
                {
                    return NotFound(new { message = $"Product with ID {id} not found." });
                }

                // Validate category if provided
                if (request.CategoryId <= 0)
                {
                    return BadRequest(new { message = "Please provide a valid category ID." });
                }

                var categoryExists = await categories.GetByIdAsync(request.CategoryId, new QueryOptions<Category>());
                if (categoryExists == null)
                {
                    return BadRequest(new { message = "Selected category does not exist." });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Update product properties
                existingProduct.Name = request.Name;
                existingProduct.Description = request.Description;
                existingProduct.Price = request.Price;
                existingProduct.Stock = request.Stock;
                existingProduct.CategoryId = request.CategoryId;

                // Handle file upload
                if (request.ImageFile != null)
                {
                    // Delete old image if it exists
                    if (!string.IsNullOrEmpty(existingProduct.ImageUrl))
                    {
                        string oldImagePath = Path.Combine(_webHostEnvironment.WebRootPath, existingProduct.ImageUrl.TrimStart('/'));
                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");

                    // Create directory if it doesn't exist
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + request.ImageFile.FileName;
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.ImageFile.CopyToAsync(fileStream);
                    }

                    existingProduct.ImageUrl = "/images/" + uniqueFileName;
                }

                // Update product ingredients
                existingProduct.ProductIngredients?.Clear();
                if (request.IngredientIds != null && request.IngredientIds.Length > 0)
                {
                    foreach (int ingredientId in request.IngredientIds)
                    {
                        var ingredientExists = await ingredients.GetByIdAsync(ingredientId, new QueryOptions<Ingredient>());
                        if (ingredientExists != null)
                        {
                            existingProduct.ProductIngredients?.Add(new ProductIngredient
                            {
                                IngredientId = ingredientId,
                                ProductId = id
                            });
                        }
                    }
                }

                await products.UpdateAsync(existingProduct);

                // Return updated product as DTO with relationships
                var updatedProduct = await products.GetByIdAsync(id, new QueryOptions<Product>
                {
                    Includes = "ProductIngredients.Ingredient, Category"
                });

                var productDetailDto = new ProductDetailDto
                {
                    ProductId = updatedProduct.ProductId,
                    Name = updatedProduct.Name,
                    Description = updatedProduct.Description,
                    Price = updatedProduct.Price,
                    Stock = updatedProduct.Stock,
                    ImageUrl = updatedProduct.ImageUrl,
                    CategoryId = updatedProduct.CategoryId,
                    CategoryName = updatedProduct.Category?.Name ?? "Unknown",
                    Ingredients = updatedProduct.ProductIngredients?.Select(pi => new IngredientDto
                    {
                        IngredientId = pi.Ingredient.IngredientId,
                        Name = pi.Ingredient.Name,
                        Description = pi.Ingredient.Description
                    }).ToList() ?? new List<IngredientDto>()
                };

                return Ok(productDetailDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error updating product: {ex.GetBaseException().Message}" });
            }
        }

        // DELETE: api/AdminProduct/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            try
            {
                // Get the product to delete the image file as well
                var product = await products.GetByIdAsync(id, new QueryOptions<Product>());
                if (product == null)
                {
                    return NotFound(new { message = $"Product with ID {id} not found." });
                }

                // Delete associated image file
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    string imagePath = Path.Combine(_webHostEnvironment.WebRootPath, product.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }
                }

                await products.DeleteAsync(id);
                return Ok(new { message = $"Product with ID {id} has been deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Product could not be deleted: {ex.GetBaseException().Message}" });
            }
        }

        // GET: api/AdminProduct/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            try
            {
                var allCategories = await categories.GetAllAsync();
                var categoryDtos = allCategories.Select(c => new CategoryDto
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    Description = c.Description
                }).ToList();

                return Ok(categoryDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error retrieving categories: {ex.GetBaseException().Message}" });
            }
        }

        // GET: api/AdminProduct/ingredients
        [HttpGet("ingredients")]
        public async Task<ActionResult<IEnumerable<IngredientDto>>> GetIngredients()
        {
            try
            {
                var allIngredients = await ingredients.GetAllAsync();
                var ingredientDtos = allIngredients.Select(i => new IngredientDto
                {
                    IngredientId = i.IngredientId,
                    Name = i.Name,
                    Description = i.Description
                }).ToList();

                return Ok(ingredientDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error retrieving ingredients: {ex.GetBaseException().Message}" });
            }
        }

        // POST: api/AdminProduct/fix-image-urls
        [HttpPost("fix-image-urls")]
        public async Task<ActionResult> FixImageUrls()
        {
            try
            {
                var allProducts = await products.GetAllAsync();
                int fixedCount = 0;

                foreach (var product in allProducts)
                {
                    if (!string.IsNullOrEmpty(product.ImageUrl) &&
                        !product.ImageUrl.StartsWith("/images/") &&
                        !product.ImageUrl.StartsWith("/"))
                    {
                        // Store the old URL for logging
                        string oldUrl = product.ImageUrl;

                        // Fix the URL by adding /images/ prefix
                        product.ImageUrl = "/images/" + product.ImageUrl;

                        // Update the product
                        await products.UpdateAsync(product);
                        fixedCount++;

                        // Log the change
                        System.Diagnostics.Debug.WriteLine($"Fixed: {oldUrl} → {product.ImageUrl}");
                    }
                }

                return Ok(new { message = $"Successfully fixed {fixedCount} image URLs!", fixedCount = fixedCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error fixing image URLs: {ex.Message}" });
            }
        }
    }

 
   
}