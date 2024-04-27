import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../Models/add-blog-post.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogPostService } from '../services/blog-post.service';
import { response } from 'express';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/Models/category.model';
import { ImageSelectorComponent } from "../../../shared/components/image-selector/image-selector.component";
import { ImageService } from '../../../shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  standalone: true,
  templateUrl: './add-blogpost.component.html',
  styleUrl: './add-blogpost.component.css',
  imports: [FormsModule, CommonModule, ImageSelectorComponent]
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model: AddBlogPost;
  isImageSelectorVisible: boolean = false;
  categories$?: Observable<Category[]>;
  imageSelectorSubscription?: Subscription;

  constructor(private blogPostService: BlogPostService,
    private router: Router,
    private categoryService: CategoryService,
    private imageService: ImageService) {
    this.model = {
      title: '',
      shortDescription: '',
      UrlHandle: '',
      content: '',
      featuredImageUrl: '',
      author: '',
      isVisible: true,
      publishedDate: new Date(),
      categories: []
    }
  }

  onSubmitForm(): void {
    console.log(this.model);
    this.blogPostService.createBlogPost(this.model).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/admin/blogposts');
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  openImageSelector(): void {
    this.isImageSelectorVisible = true
  }
  closeImageSelector(): void {
    this.isImageSelectorVisible = false;
  }


  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
    this.imageSelectorSubscription = this.imageService.onSelectImage().subscribe({
      next: (selectedImage) => {
        this.model.featuredImageUrl = selectedImage.url;
        this.isImageSelectorVisible = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.imageSelectorSubscription?.unsubscribe();
  }
}
