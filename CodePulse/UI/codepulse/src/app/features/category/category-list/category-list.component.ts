import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { response } from 'express';
import { Category } from '../Models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {

  categories$?: Observable<Category[]>;
  constructor(private categoryService: CategoryService) { }
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
  }
}
