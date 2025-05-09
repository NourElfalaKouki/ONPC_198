// ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;

namespace LocationApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {
        }

        public DbSet<LocationApp.Models.Utilisateur> users { get; set; }

    }
}
