using CodePulse.API.Data;
using CodePulse.API.Models.Domain;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Repositories.Implementation
{
    public class BlogPostRepository : IBlogPostRepository
    {
        private readonly ApplicationDBContext dBContext;

        public BlogPostRepository(ApplicationDBContext dBContext)
        {
            this.dBContext = dBContext;
        }
        public async Task<BlogPost> CreateAsync(BlogPost blogPost)
        {
           await this.dBContext.BlogPosts.AddAsync(blogPost);
           await dBContext.SaveChangesAsync();
            return blogPost;
        }

        

        public async Task<IEnumerable<BlogPost>> GetAllAsync()
        {
            return await dBContext.BlogPosts.Include(x=>x.Categories).ToListAsync();
        }

        public async  Task<BlogPost?> GetByIdAsync(Guid id)
        {
             return await dBContext.BlogPosts.Include(x=>x.Categories).FirstOrDefaultAsync(x=>x.Id == id);   
        }

        public async Task<BlogPost?> UpdateAsync(BlogPost blogPost)
        {
            var existingBlogPost = await dBContext.BlogPosts.Include(x=>x.Categories)
                .FirstOrDefaultAsync(x => x.Id == blogPost.Id);

            if(existingBlogPost == null)
            {
                return null;
            }
            //update BlogPost
            dBContext.Entry(existingBlogPost).CurrentValues.SetValues(blogPost);
            //Update Categories
            existingBlogPost.Categories = blogPost.Categories;
            await dBContext.SaveChangesAsync();
            return blogPost;
        }
        [HttpDelete]
        public async Task<BlogPost?> DeleteAsync(Guid id)
        {
          var existingBlogPost = await dBContext.BlogPosts.FirstOrDefaultAsync(x=>x.Id==id);

            if (existingBlogPost != null)
            {
                dBContext.BlogPosts.Remove(existingBlogPost);
                await dBContext.SaveChangesAsync();
                return existingBlogPost;
            }
            return null;
        }
    }
}
