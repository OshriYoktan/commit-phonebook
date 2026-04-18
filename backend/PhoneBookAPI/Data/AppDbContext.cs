using Microsoft.EntityFrameworkCore;
using PhoneBookAPI.Entities;

namespace PhoneBookAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    PasswordHash = "AQAAAAIAAYagAAAAEGgP6n8QJvk8enF/sllgTYSspJSdtbgSu8hvl5NJhokUSw7GQCl8jHbCs2+On//YAQ==",
                    Role = Role.Admin
                },
                new User
                {
                    Id = 2,
                    Username = "guest",
                    PasswordHash = "AQAAAAIAAYagAAAAEGgP6n8QJvk8enF/sllgTYSspJSdtbgSu8hvl5NJhokUSw7GQCl8jHbCs2+On//YAQ==",
                    Role = Role.User
                }
            );
        }
    }
}