using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TequliesResturent.Data;
using TequliesResturent.Models;
using TequliasRestaurant.Models;
using TequliasRestaurant.Models.DTOs;

namespace TequliasRestaurant.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrdersController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        /// <summary>
        /// Create a new order for the authenticated user
        /// </summary>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }

            // Validate products exist and get their current prices
            var productIds = request.OrderItems.Select(oi => oi.ProductId).Distinct().ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.ProductId))
                .ToDictionaryAsync(p => p.ProductId, p => p);

            // Check if all requested products exist
            var missingProducts = productIds.Where(id => !products.ContainsKey(id)).ToList();
            if (missingProducts.Any())
            {
                return BadRequest($"Products with IDs [{string.Join(", ", missingProducts)}] not found");
            }

            // Create order items with current product prices
            var orderItems = request.OrderItems.Select(oi => new OrderItem
            {
                ProductId = oi.ProductId,
                Quantity = oi.Quantity,
                UnitPrice = products[oi.ProductId].Price
            }).ToList();

            // Calculate total amount
            var totalAmount = orderItems.Sum(oi => oi.Quantity * oi.UnitPrice);

            // Create the order
            var order = new Order
            {
                OrderDate = DateTime.Now,
                TotalAmount = totalAmount,
                UserId = userId,
                FullName = request.FullName,
                Address = request.Address,
                ContactNumber = request.ContactNumber,
                PaymentMethod = request.PaymentMethod,
                OrderItems = orderItems
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Return the created order
            var response = await MapToOrderResponseAsync(order);
            return Ok(response);
        }

        /// <summary>
        /// Get all orders for the authenticated user
        /// </summary>
        [HttpGet("mine")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var response = orders.Select(order => MapToOrderResponse(order)).ToList();
            return Ok(response);
        }

        /// <summary>
        /// Get all orders (Admin only) - for checking daily sales
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            var query = _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .AsQueryable();

            // Optional date filtering for admin to check specific periods
            if (fromDate.HasValue)
            {
                query = query.Where(o => o.OrderDate.Date >= fromDate.Value.Date);
            }

            if (toDate.HasValue)
            {
                query = query.Where(o => o.OrderDate.Date <= toDate.Value.Date);
            }

            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var response = orders.Select(order => MapToOrderResponse(order)).ToList();

            // Add summary information for admin
            var summary = new
            {
                TotalOrders = orders.Count,
                TotalRevenue = orders.Sum(o => o.TotalAmount),
                DateRange = new
                {
                    From = fromDate?.ToString("yyyy-MM-dd") ?? "All time",
                    To = toDate?.ToString("yyyy-MM-dd") ?? "All time"
                },
                Orders = response
            };

            return Ok(summary);
        }

        /// <summary>
        /// Get a specific order by ID (User can only see their own orders, Admin can see all)
        /// </summary>
        [HttpGet("{orderId:int}")]
        public async Task<IActionResult> GetOrderById(int orderId)
        {
            var userId = _userManager.GetUserId(User);
            var isAdmin = User.IsInRole("Admin");

            var query = _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.OrderId == orderId);

            // If not admin, restrict to user's own orders
            if (!isAdmin)
            {
                query = query.Where(o => o.UserId == userId);
            }

            var order = await query.FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound("Order not found");
            }

            var response = MapToOrderResponse(order);
            return Ok(response);
        }

        private OrderResponse MapToOrderResponse(Order order)
        {
            return new OrderResponse
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                FullName = order.FullName,
                Address = order.Address,
                ContactNumber = order.ContactNumber,
                PaymentMethod = order.PaymentMethod,
                OrderItems = order.OrderItems?.Select(oi => new OrderItemResponse
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product?.Name ?? "Unknown Product",
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList() ?? new List<OrderItemResponse>()
            };
        }

        private async Task<OrderResponse> MapToOrderResponseAsync(Order order)
        {
            // If OrderItems are not loaded, load them with products
            if (order.OrderItems == null || !order.OrderItems.Any() || order.OrderItems.First().Product == null)
            {
                await _context.Entry(order)
                    .Collection(o => o.OrderItems)
                    .Query()
                    .Include(oi => oi.Product)
                    .LoadAsync();
            }

            return MapToOrderResponse(order);
        }
    }
}