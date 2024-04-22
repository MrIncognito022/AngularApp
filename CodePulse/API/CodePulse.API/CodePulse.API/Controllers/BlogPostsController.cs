using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostsController : ControllerBase
    {
        private readonly IBlogPostRepository blogPostRepository;
        private readonly ICategoryRepository categoryRepository;

        public BlogPostsController(IBlogPostRepository blogPostRepository, ICategoryRepository categoryRepository)
        {
            this.blogPostRepository = blogPostRepository;
            this.categoryRepository = categoryRepository;
        }
        [HttpPost]
        public async Task<IActionResult> CreateBlogPost([FromBody] CreateblogPostRequestDto request)
        {
            // Convert DTo to Domain Models
            var blogPost = new BlogPost
            {
                Title = request.Title,
                FeaturedImageUrl = request.FeaturedImageUrl,
                Author = request.Author,
                Content = request.Content,
                ShortDescription = request.ShortDescription,
                IsVisible = request.IsVisible,
                PublisherDate = request.PublisherDate,
                UrlHandle = request.UrlHandle,
                Categories = new List<Category>()
            };
            //
            foreach (var categoryGuid in request.Categories)
            {
                var existingCategory = await categoryRepository.GetById(categoryGuid);
                if (existingCategory is not null)
                {
                    blogPost.Categories.Add(existingCategory);
                }
            }

            blogPost = await blogPostRepository.CreateAsync(blogPost);
            //convert Domain Model to Dto
            var response = new BlogPostDto
            {
                Id = blogPost.Id,
                Title = blogPost.Title,
                FeaturedImageUrl = blogPost.FeaturedImageUrl,
                Author = blogPost.Author,
                Content = blogPost.Content,
                ShortDescription = blogPost.ShortDescription,
                IsVisible = blogPost.IsVisible,
                PublisherDate = blogPost.PublisherDate,
                UrlHandle = blogPost.UrlHandle,
                Categories = blogPost.Categories.Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlHandle = x.UrlHandle,
                }).ToList()
            };
            return Ok(response);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllBlogPosts()
        {
            var blogposts = await blogPostRepository.GetAllAsync();
            //convert domain to dto
            var response = new List<BlogPostDto>();
            foreach (var blogPost in blogposts)
            {
                response.Add(new BlogPostDto
                {
                    Id = blogPost.Id,
                    Title = blogPost.Title,
                    FeaturedImageUrl = blogPost.FeaturedImageUrl,
                    Author = blogPost.Author,
                    Content = blogPost.Content,
                    ShortDescription = blogPost.ShortDescription,
                    IsVisible = blogPost.IsVisible,
                    PublisherDate = blogPost.PublisherDate,
                    UrlHandle = blogPost.UrlHandle,
                    Categories = blogPost.Categories.Select(x => new CategoryDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        UrlHandle = x.UrlHandle
                    }).ToList()
                });
            }
            return Ok(response);
        }

        //GET: {apiUrl}/api/blogpost/{id}
        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetBlogPostById([FromRoute] Guid id)
        {
            var blogPost = await blogPostRepository.GetByIdAsync(id);

            if (blogPost is null)
            {
                return NotFound();
            }

            var response = new BlogPostDto
            {
                Id = blogPost.Id,
                Title = blogPost.Title,
                FeaturedImageUrl = blogPost.FeaturedImageUrl,
                Author = blogPost.Author,
                Content = blogPost.Content,
                ShortDescription = blogPost.ShortDescription,
                IsVisible = blogPost.IsVisible,
                PublisherDate = blogPost.PublisherDate,
                UrlHandle = blogPost.UrlHandle,
                Categories = blogPost.Categories.Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlHandle = x.UrlHandle
                }).ToList()
            };

            return Ok(response);
        }


        //PUT
        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateBlogPostById([FromRoute] Guid id, UpdateBlogPostRequestDto request)
        {
            var blogPost = new BlogPost
            {
                Id = id,
                Title = request.Title,
                FeaturedImageUrl = request.FeaturedImageUrl,
                Author = request.Author,
                Content = request.Content,
                ShortDescription = request.ShortDescription,
                IsVisible = request.IsVisible,
                PublisherDate = request.PublisherDate,
                UrlHandle = request.UrlHandle,
                Categories = new List<Category>()
            };
            foreach(var categoryGuid in request.Categories)
            {
               var existingCategory =   await categoryRepository.GetById(categoryGuid);
               if (existingCategory != null)
                {
                    blogPost.Categories.Add(existingCategory);
                }
            }
            //Call Repository to Update BlogPost
            var updatedBlogPost = await blogPostRepository.UpdateAsync(blogPost);
            if(updatedBlogPost is null)
            {
                return NotFound();
            }
            var response = new BlogPostDto
            {
                Id = blogPost.Id,
                Title = blogPost.Title,
                FeaturedImageUrl = blogPost.FeaturedImageUrl,
                Author = blogPost.Author,
                Content = blogPost.Content,
                ShortDescription = blogPost.ShortDescription,
                IsVisible = blogPost.IsVisible,
                PublisherDate = blogPost.PublisherDate,
                UrlHandle = blogPost.UrlHandle,
                Categories = blogPost.Categories.Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlHandle = x.UrlHandle
                }).ToList()
            };
            return Ok(response);
        }

    }
}
