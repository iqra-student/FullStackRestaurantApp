using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using TequliesResturent.Data;
using TequliesResturent.Models;
using TequliesResturent.DTOs.IngredientDTOs;
namespace TequliesResturent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminIngredientController : ControllerBase
    {
        private Repository<Ingredient> ingredients;

        public AdminIngredientController(ApplicationDbContext context)
        {
            ingredients = new Repository<Ingredient>(context);
        }

        // GET: api/AdminIngredient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IngredientDto>>> GetAllIngredients()
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

        // GET: api/AdminIngredient/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<IngredientDetailDto>> GetIngredient(int id)
        {
            try
            {
                var ingredient = await ingredients.GetByIdAsync(id, new QueryOptions<Ingredient>
                {
                    Includes = "ProductIngredients.Product"
                });

                if (ingredient == null)
                {
                    return NotFound(new { message = $"Ingredient with ID {id} not found." });
                }

                var ingredientDetailDto = new IngredientDetailDto
                {
                    IngredientId = ingredient.IngredientId,
                    Name = ingredient.Name,
                    Description = ingredient.Description,
                    Products = ingredient.ProductIngredients?.Select(pi => new ProductDto
                    {
                        ProductId = pi.Product.ProductId,
                        Name = pi.Product.Name,
                        Description = pi.Product.Description,
                        Price = pi.Product.Price,
                        Stock = pi.Product.Stock,
                        ImageUrl = pi.Product.ImageUrl,
                        CategoryId = pi.Product.CategoryId,
                        CategoryName = pi.Product.Category?.Name ?? "Unknown"
                    }).ToList() ?? new List<ProductDto>()
                };

                return Ok(ingredientDetailDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error retrieving ingredient: {ex.GetBaseException().Message}" });
            }
        }

        // POST: api/AdminIngredient
        [HttpPost]
        public async Task<ActionResult<IngredientDto>> CreateIngredient([FromBody] IngredientCreateRequest request)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if ingredient with same name already exists
                var existingIngredients = await ingredients.GetAllAsync();
                if (existingIngredients.Any(i => i.Name.ToLower() == request.Name.ToLower()))
                {
                    return BadRequest(new { message = "An ingredient with this name already exists." });
                }

                var ingredient = new Ingredient
                {
                    Name = request.Name,
                    Description = request.Description
                };

                await ingredients.AddAsync(ingredient);

                var ingredientDto = new IngredientDto
                {
                    IngredientId = ingredient.IngredientId,
                    Name = ingredient.Name,
                    Description = ingredient.Description
                };

                return CreatedAtAction(nameof(GetIngredient), new { id = ingredient.IngredientId }, ingredientDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error creating ingredient: {ex.GetBaseException().Message}" });
            }
        }

        // PUT: api/AdminIngredient/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<IngredientDto>> UpdateIngredient(int id, [FromBody] IngredientUpdateRequest request)
        {
            try
            {
                var existingIngredient = await ingredients.GetByIdAsync(id, new QueryOptions<Ingredient>());

                if (existingIngredient == null)
                {
                    return NotFound(new { message = $"Ingredient with ID {id} not found." });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if another ingredient with same name already exists (excluding current ingredient)
                var allIngredients = await ingredients.GetAllAsync();
                if (allIngredients.Any(i => i.Name.ToLower() == request.Name.ToLower() && i.IngredientId != id))
                {
                    return BadRequest(new { message = "An ingredient with this name already exists." });
                }

                // Update ingredient properties
                existingIngredient.Name = request.Name;
                existingIngredient.Description = request.Description;

                await ingredients.UpdateAsync(existingIngredient);

                var ingredientDto = new IngredientDto
                {
                    IngredientId = existingIngredient.IngredientId,
                    Name = existingIngredient.Name,
                    Description = existingIngredient.Description
                };

                return Ok(ingredientDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error updating ingredient: {ex.GetBaseException().Message}" });
            }
        }

        // DELETE: api/AdminIngredient/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteIngredient(int id)
        {
            try
            {
                var ingredient = await ingredients.GetByIdAsync(id, new QueryOptions<Ingredient>
                {
                    Includes = "ProductIngredients"
                });

                if (ingredient == null)
                {
                    return NotFound(new { message = $"Ingredient with ID {id} not found." });
                }

                // Check if ingredient is being used by any products
                if (ingredient.ProductIngredients != null && ingredient.ProductIngredients.Any())
                {
                    return BadRequest(new
                    {
                        message = $"Cannot delete ingredient '{ingredient.Name}' because it is being used by {ingredient.ProductIngredients.Count} product(s). Remove it from all products first."
                    });
                }

                await ingredients.DeleteAsync(id);
                return Ok(new { message = $"Ingredient '{ingredient.Name}' with ID {id} has been deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Ingredient could not be deleted: {ex.GetBaseException().Message}" });
            }
        }

        // GET: api/AdminIngredient/check-usage/{id}
        [HttpGet("check-usage/{id}")]
        public async Task<ActionResult> CheckIngredientUsage(int id)
        {
            try
            {
                var ingredient = await ingredients.GetByIdAsync(id, new QueryOptions<Ingredient>
                {
                    Includes = "ProductIngredients.Product"
                });

                if (ingredient == null)
                {
                    return NotFound(new { message = $"Ingredient with ID {id} not found." });
                }

                var usageInfo = new
                {
                    IngredientId = ingredient.IngredientId,
                    IngredientName = ingredient.Name,
                    IsInUse = ingredient.ProductIngredients?.Any() ?? false,
                    ProductCount = ingredient.ProductIngredients?.Count ?? 0,
                    Products = ingredient.ProductIngredients?.Select(pi => new ProductUsageDto
                    {
                        ProductId = pi.Product.ProductId,
                        ProductName = pi.Product.Name
                    }).ToList() ?? new List<ProductUsageDto>()

            };

                return Ok(usageInfo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error checking ingredient usage: {ex.GetBaseException().Message}" });
            }
        }

        // POST: api/AdminIngredient/bulk-create
        [HttpPost("bulk-create")]
        public async Task<ActionResult<IEnumerable<IngredientDto>>> BulkCreateIngredients([FromBody] List<IngredientCreateRequest> requests)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (requests == null || !requests.Any())
                {
                    return BadRequest(new { message = "No ingredients provided for creation." });
                }

                var createdIngredients = new List<IngredientDto>();
                var errors = new List<string>();

                // Get existing ingredients to check for duplicates
                var existingIngredients = await ingredients.GetAllAsync();
                var existingNames = existingIngredients.Select(i => i.Name.ToLower()).ToHashSet();

                foreach (var request in requests)
                {
                    // Check for duplicate names
                    if (existingNames.Contains(request.Name.ToLower()))
                    {
                        errors.Add($"Ingredient '{request.Name}' already exists and was skipped.");
                        continue;
                    }

                    var ingredient = new Ingredient
                    {
                        Name = request.Name,
                        Description = request.Description
                    };

                    try
                    {
                        await ingredients.AddAsync(ingredient);
                        existingNames.Add(request.Name.ToLower()); // Add to prevent duplicates within the same request

                        createdIngredients.Add(new IngredientDto
                        {
                            IngredientId = ingredient.IngredientId,
                            Name = ingredient.Name,
                            Description = ingredient.Description
                        });
                    }
                    catch (Exception ex)
                    {
                        errors.Add($"Failed to create ingredient '{request.Name}': {ex.Message}");
                    }
                }

                var response = new
                {
                    CreatedCount = createdIngredients.Count,
                    CreatedIngredients = createdIngredients,
                    Errors = errors
                };

                if (createdIngredients.Any())
                {
                    return Ok(response);
                }
                else
                {
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error in bulk create: {ex.GetBaseException().Message}" });
            }
        }
    }

  
}