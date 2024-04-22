import { Component, OnInit } from '@angular/core';
import { AddBlogPost } from '../Models/add-blog-post.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogPostService } from '../services/blog-post.service';
import { response } from 'express';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable } from 'rxjs';
import { Category } from '../../category/Models/category.model';

@Component({
  selector: 'app-add-blogpost',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-blogpost.component.html',
  styleUrl: './add-blogpost.component.css'
})
export class AddBlogpostComponent implements OnInit {
  model: AddBlogPost;
  categories$?: Observable<Category[]>;
  constructor(private blogPostService: BlogPostService,
    private router: Router,
    private categoryService: CategoryService) {
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
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
  }
}
