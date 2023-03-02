using Microsoft.EntityFrameworkCore;
using Catalog.Models;

namespace Catalog.Data{

    public class UserContext : DbContext {

        public UserContext(DbContextOptions<UserContext> opt) : base(opt)
        {

        }

        public DbSet<User> Users { get; set; } //this is our List of Users. This DBSet it's a list but retrieved from the DB
        
    }
}