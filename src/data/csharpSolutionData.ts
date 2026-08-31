import { CSharpFile } from '../types';

export const csharpSolutionFiles: CSharpFile[] = [
  {
    id: 'csproj',
    filename: 'NuriSushi.Backend.csproj',
    path: 'NuriSushi.Backend/NuriSushi.Backend.csproj',
    language: 'xml',
    description: 'Visual Studio C# .NET 9.0 Web API Project configuration file',
    content: `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <DockerDefaultTargetOS>Linux</DockerDefaultTargetOS>
    <RootNamespace>NuriSushi.Backend</RootNamespace>
    <Title>Nuri Sushi - Modern Japanese Minimalist API</Title>
    <Version>1.0.0</Version>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.1" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="9.0.1">
      <PrivateAssets>all</PrivateAssets>
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.AspNetCore.SignalR.Common" Version="9.0.1" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="7.2.0" />
    <PackageReference Include="Google.GenAI" Version="2.4.0" />
  </ItemGroup>

</Project>`
  },
  {
    id: 'sushi-item-model',
    filename: 'SushiItem.cs',
    path: 'NuriSushi.Backend/Models/SushiItem.cs',
    language: 'csharp',
    description: 'C# Entity Framework Core Data Model for Nuri Sushi Menu Items',
    content: `using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NuriSushi.Backend.Models
{
    [Table("SushiItems")]
    public class SushiItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(100)]
        public string? JapaneseName { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = "rolls"; // rolls, sashimi, nigiri, desserts

        [Required]
        [StringLength(1000)]
        public string ImageUrl { get; set; } = string.Empty;

        public bool IsChefSpecial { get; set; } = false;

        public string? Collection { get; set; } // PRESTIGE COLLECTION

        public int Calories { get; set; }

        [StringLength(20)]
        public string Pieces { get; set; } = "8 Pcs";

        public bool IsSpicy { get; set; } = false;

        public bool IsGlutenFree { get; set; } = false;

        public bool IsAvailable { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}`
  },
  {
    id: 'sushi-controller',
    filename: 'SushiMenuController.cs',
    path: 'NuriSushi.Backend/Controllers/SushiMenuController.cs',
    language: 'csharp',
    description: 'C# ASP.NET Core REST API Controller for Menu Operations & Search',
    content: `using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuriSushi.Backend.Data;
using NuriSushi.Backend.Models;

namespace NuriSushi.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class SushiMenuController : ControllerBase
    {
        private readonly NuriDbContext _context;
        private readonly ILogger<SushiMenuController> _logger;

        public SushiMenuController(NuriDbContext context, ILogger<SushiMenuController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all active menu items with optional category filtering
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SushiItem>>> GetMenu([FromQuery] string? category, [FromQuery] string? search)
        {
            var query = _context.SushiItems.Where(s => s.IsAvailable).AsQueryable();

            if (!string.IsNullOrWhiteSpace(category) && category.ToLower() != "all")
            {
                query = query.Where(s => s.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(s => s.Name.Contains(search) || s.Description.Contains(search));
            }

            var items = await query.OrderByDescending(s => s.IsChefSpecial).ToListAsync();
            return Ok(items);
        }

        /// <summary>
        /// Retrieves seasonal creations featured in the homepage bento grid
        /// </summary>
        [HttpGet("seasonal")]
        public async Task<ActionResult<IEnumerable<SushiItem>>> GetSeasonalCreations()
        {
            var items = await _context.SushiItems
                .Where(s => s.IsChefSpecial || s.Collection == "PRESTIGE COLLECTION")
                .Take(4)
                .ToListAsync();

            return Ok(items);
        }

        /// <summary>
        /// Creates a new gourmet sushi item (Admin access)
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<SushiItem>> CreateSushiItem([FromBody] SushiItem item)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.SushiItems.Add(item);
            await _context.SaveChangesAsync();

            _logger.LogInformation("New sushi item created: {Name} (${'Price'})", item.Name, item.Price);
            return CreatedAtAction(nameof(GetMenu), new { id = item.Id }, item);
        }
    }
}`
  },
  {
    id: 'orders-controller',
    filename: 'OrdersController.cs',
    path: 'NuriSushi.Backend/Controllers/OrdersController.cs',
    language: 'csharp',
    description: 'C# ASP.NET Core Orders API with SignalR Real-Time Kitchen Broadcasting',
    content: `using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using NuriSushi.Backend.Data;
using NuriSushi.Backend.Hubs;
using NuriSushi.Backend.Models;

namespace NuriSushi.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly NuriDbContext _context;
        private readonly IHubContext<OrderTrackingHub> _hubContext;

        public OrdersController(NuriDbContext context, IHubContext<OrderTrackingHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var order = new Order
            {
                Id = Guid.NewGuid(),
                CustomerName = dto.CustomerName,
                Email = dto.Email,
                Phone = dto.Phone,
                DeliveryAddress = dto.DeliveryAddress,
                PaymentMethod = dto.PaymentMethod,
                Subtotal = dto.Subtotal,
                DiscountAmount = dto.DiscountAmount,
                TotalAmount = dto.TotalAmount,
                Status = OrderStatus.Received,
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Broadcast real-time signal to Kitchen Display System (KDS)
            await _hubContext.Clients.All.SendAsync("OrderReceived", order);

            return Ok(new { orderId = order.Id, status = order.Status.ToString(), estimatedMinutes = 35 });
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = dto.NewStatus;
            await _context.SaveChangesAsync();

            // Notify customer in real-time on front-end tracker
            await _hubContext.Clients.Group(id.ToString()).SendAsync("OrderStatusUpdated", order.Status.ToString());

            return Ok(order);
        }
    }
}`
  },
  {
    id: 'hub-cs',
    filename: 'OrderTrackingHub.cs',
    path: 'NuriSushi.Backend/Hubs/OrderTrackingHub.cs',
    language: 'csharp',
    description: 'C# SignalR WebSockets Hub for Real-time Kitchen & Customer Order Tracking',
    content: `using Microsoft.AspNetCore.SignalR;

namespace NuriSushi.Backend.Hubs
{
    public class OrderTrackingHub : Hub
    {
        public async Task JoinOrderTrackerGroup(string orderId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, orderId);
        }

        public async Task BroadcastKitchenPrepStatus(string orderId, string status)
        {
            await Clients.Group(orderId).SendAsync("OrderStatusUpdated", status);
        }
    }
}`
  },
  {
    id: 'dbcontext-cs',
    filename: 'NuriDbContext.cs',
    path: 'NuriSushi.Backend/Data/NuriDbContext.cs',
    language: 'csharp',
    description: 'C# Entity Framework Core Database Context with Seed Data',
    content: `using Microsoft.EntityFrameworkCore;
using NuriSushi.Backend.Models;

namespace NuriSushi.Backend.Data
{
    public class NuriDbContext : DbContext
    {
        public NuriDbContext(DbContextOptions<NuriDbContext> options) : base(options) { }

        public DbSet<SushiItem> SushiItems { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SushiItem>().HasData(
                new SushiItem
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Name = "Red Dragon Signature",
                    JapaneseName = "レッドドラゴン",
                    Description = "Fresh spicy tuna, avocado, cucumber, topped with seared red tuna slices and micro-greens.",
                    Price = 24.00m,
                    Category = "rolls",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAjb8JDtnyqoITapwuGNqGr4K4Q4kPiG7uN6L113EE1r0TyK95ilcjdUORZG4fsMqv5aahwz1srlkYRQtT79fbcZ-5f1jwFOKl6tLvOpUMAIvKFGiLMQctQP3FT1PIpfthA9NOu1Lw9LPjj8bSEhcp6vXMVku5YlwgjMV-gXnAMc7P8guQ1oUWc-5_anM_MhYbYbXh7Nc-_AiCF39_svnUid4AK5uRvmfdaPL5MEYkwRQNYQCPBQ2jKTgPnTsNY45r33Bb7J1KQcxCf",
                    IsChefSpecial = true,
                    Collection = "PRESTIGE COLLECTION",
                    Calories = 480
                }
            );
        }
    }
}`
  },
  {
    id: 'program-cs',
    filename: 'Program.cs',
    path: 'NuriSushi.Backend/Program.cs',
    language: 'csharp',
    description: 'Visual Studio C# ASP.NET Core Program Entry Point & Services Initialization',
    content: `using Microsoft.EntityFrameworkCore;
using NuriSushi.Backend.Data;
using NuriSushi.Backend.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Entity Framework Core SQL Server configuration
builder.Services.AddDbContext<NuriDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("NuriSushiDatabase")));

// CORS Configuration for React Front-End
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNuriFrontend", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowNuriFrontend");
app.UseAuthorization();
app.MapControllers();
app.MapHub<OrderTrackingHub>("/hubs/ordertracker");

app.Run();`
  }
];
