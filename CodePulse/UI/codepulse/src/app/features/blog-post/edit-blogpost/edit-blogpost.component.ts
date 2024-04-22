import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../Models/blog-post.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/Models/category.model';
import { UpdateBlogPost } from '../Models/update-blog-post.model';
import { throws } from 'assert';


@Component({
  selector: 'app-edit-blogpost',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-blogpost.component.html',
  styleUrl: './edit-blogpost.component.css'
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id: string | null = null;
  routeSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[]
  constructor(private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private router: Router) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
    this.routeSubscription = this.route.paramMap.subscribe({
      next: (param) => {
        this.id = param.get('id');
        if (this.id) {
          this.blogPostService.getBlogPostById(this.id)
            .subscribe({
              next: (response) => {
                this.model = response;
                this.selectedCategories = response.categories.map(x => x.id);
              }
            });
        }
      }
    });
  }

  onSubmitForm(): void {
    console.log("form Submitted");
    if (this.model && this.id) {
      var updateBlogPost: UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        shortDescription: this.model.shortDescription,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible,
        publishedDate: this.model.publishedDate,
        title: this.model.title,
        UrlHandle: this.model.UrlHandle,
        categories: this.selectedCategories ?? []
      }
      console.log(this.model);
      this.updateBlogPostSubscription = this.blogPostService.updateBlogPost(this.id, updateBlogPost)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe()
    this.updateBlogPostSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
  }

}
