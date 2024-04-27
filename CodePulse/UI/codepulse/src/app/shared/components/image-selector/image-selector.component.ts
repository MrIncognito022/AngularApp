import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EventEmitter } from 'stream';
import { ImageService } from './image.service';
import { response } from 'express';
import { Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.css'
})
export class ImageSelectorComponent implements OnInit {

  private file?: File;
  fileName: string = '';
  title: string = '';
  images$?: Observable<BlogImage[]>;
  @ViewChild('form', { static: false }) imageUploadForm?: NgForm;

  constructor(private imageService: ImageService) { }


  onFileUploadChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
  }

  uploadImage(): void {

    if (this.file && this.fileName !== '' && this.title !== '') {
      this.imageService.uploadImage(this.file, this.fileName, this.title)
        .subscribe({
          next: (response) => {
            this.imageUploadForm?.resetForm();
            this.getImages();
          }
        })
    }
  }

  selectImage(image: BlogImage): void {
    this.imageService.selectImage(image);
  }
  ngOnInit(): void {
    this.getImages();
  }
  private getImages() {
    this.images$ = this.imageService.getAllImages();
  }

}
