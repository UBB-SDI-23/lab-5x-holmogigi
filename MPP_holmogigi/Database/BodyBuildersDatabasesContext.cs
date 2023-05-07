using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using MPP.Models;

namespace MPP.Database;

public partial class BodyBuildersDatabasesContext : DbContext
{
    public BodyBuildersDatabasesContext() { }

    public BodyBuildersDatabasesContext(DbContextOptions<BodyBuildersDatabasesContext> options) : base(options)
    {
        Database.EnsureCreated();
    }
 
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<ConfirmationCode>()
                .HasIndex(u => u.Code)
                .IsUnique();

        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserProfile>()
                .HasKey(u => u.UserId);

        modelBuilder.Entity<User>()
                .HasIndex(u => u.Name)
                .IsUnique();

        modelBuilder.Entity<User>()
               .HasOne(u => u.UserProfile)
               .WithOne(p => p.User)
               .HasForeignKey<UserProfile>(p => p.UserId)
               .OnDelete(DeleteBehavior.ClientSetNull);

        // configure 1 to many relationship
        modelBuilder.Entity<Coach>()
        .HasOne(c => c.Gym)
        .WithMany(g => g.Coaches)
        .HasForeignKey(c => c.GymId);

        // configure many to many relationship
        modelBuilder.Entity<Contest>()
        .HasKey(c => new { c.BodybuilderId, c.CoachId });
        modelBuilder.Entity<Contest>()
            .HasOne(c => c.Coach)
            .WithMany(c => c.Contests)
            .HasForeignKey(c => c.CoachId);
        modelBuilder.Entity<Contest>()
            .HasOne(c => c.Bodybuilder)
            .WithMany(c => c.Contests)
            .HasForeignKey(c => c.BodybuilderId);


        // Assign users to entities
        modelBuilder.Entity<ConfirmationCode>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);


        modelBuilder.Entity<Gym>()
            .HasOne(u => u.User)
            .WithMany()
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull);

        modelBuilder.Entity<Coach>()
            .HasOne(u => u.User)
            .WithMany()
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull);

        modelBuilder.Entity<Contest>()
            .HasOne(u => u.User)
            .WithMany()
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull);
        
        modelBuilder.Entity<Bodybuilder>()
            .HasOne(u => u.User)
            .WithMany()
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull);
        
    }

    public virtual DbSet<Bodybuilder> Bodybuilders { get; set; }
    public virtual DbSet<Gym> Gyms { get; set; }
    public virtual DbSet<Coach> Coaches { get; set; }
    public virtual DbSet<Contest> Contests { get; set; }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<UserProfile> UserProfiles { get; set; }

    public virtual DbSet<ConfirmationCode> ConfirmationCodes { get; set; } = null!;

}