using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MPP.Migrations
{
    /// <inheritdoc />
    public partial class pls1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*
            migrationBuilder.AddColumn<int>(
                name: "PagePreference",
                table: "UserProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);
            */
            migrationBuilder.CreateTable(
                name: "ConfirmationCodes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Expiration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Used = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfirmationCodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConfirmationCodes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConfirmationCodes_Code",
                table: "ConfirmationCodes",
                column: "Code",
                unique: true,
                filter: "[Code] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ConfirmationCodes_UserId",
                table: "ConfirmationCodes",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConfirmationCodes");

            migrationBuilder.DropColumn(
                name: "PagePreference",
                table: "UserProfiles");
        }
    }
}
