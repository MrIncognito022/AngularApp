import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlHandlingStrategy } from '@angular/router';
import { nextTick } from 'process';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { response } from 'express';
import { Category } from '../Models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { updateCategoryRequest } from '../Models/update-category-request.model';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit, OnDestroy {

  category?: Category;
  id: string | null = null;
  paramsSubscription?: Subscription;
  editCategorySubscription?: Subscription;
  constructor(private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router) { }
  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id')
        console.log(this.id);
        if (this.id) {
          //get the data from API for this category
          this.categoryService.getCategoryById(this.id)
            .subscribe({
              next: (response) => {
                this.category = response;
              }
            });
        }
      }
    });
  }
  onFormSubmit(): void {
    const updateCategoryRequest: updateCategoryRequest = {
      name: this.category?.name ?? '',
      urlHandle: this.category?.urlHandle ?? ''
    }

    //Pass this object to service
    if (this.id) {
      this.editCategorySubscription = this.categoryService.updateCategory(this.id, updateCategoryRequest).
        subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/categories');
          }
        });
    }
  }

  onDelete(): void {
    if (this.id) {

      this.categoryService.deleteCategory(this.id).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/categories')
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editCategorySubscription?.unsubscribe();
  }
}
