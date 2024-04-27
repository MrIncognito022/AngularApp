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
import { ImageSelectorComponent } from '../../../shared/components/image-selector/image-selector.component';


@Component({
  selector: 'app-edit-blogpost',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageSelectorComponent],
  templateUrl: './edit-blogpost.component.html',
  styleUrl: './edit-blogpost.component.css'
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id: string | null = null;
  routeSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;
  deleteBlogPostSubscription?: Subscription;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[]
  isImageSelectorVisible: boolean = false;


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
  onDelete(): void {
    console.log("Delete Executed")
    console.log(typeof (this.id))
    if (this.id) {
      this.deleteBlogPostSubscription = this.blogPostService.deleteBlogPost(this.id)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
          }
        });
    }
  }
  openImageSelector(): void {
    this.isImageSelectorVisible = true
  }
  closeImageSelector(): void {
    this.isImageSelectorVisible = false;
  }
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe()
    this.updateBlogPostSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
  }

}
