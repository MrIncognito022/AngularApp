using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodePulse.API.Migrations
{
    /// <inheritdoc />
    public partial class changecolumnname : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShortContent",
                table: "BlogPosts",
                newName: "ShortDescription");

            migrationBuilder.RenameColumn(
                name: "FeatureImage",
                table: "BlogPosts",
                newName: "FeaturedImageUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShortDescription",
                table: "BlogPosts",
                newName: "ShortContent");

            migrationBuilder.RenameColumn(
                name: "FeaturedImageUrl",
                table: "BlogPosts",
                newName: "FeatureImage");
        }
    }
}
