import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Image, ImageDatapoint } from 'src/app/models/project.model';
import { IfbappService } from 'src/app/services/ifbapp.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.css']
})
export class ImageDetailsComponent implements OnInit {

  image: Image = {};
  imageData?: Array<ImageDatapoint>; 

  constructor(
    private ifbappService: IfbappService,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.getImageDetails(this.route.snapshot.params['imageId']);
    this.getImageData(this.route.snapshot.params['imageId']);
  }

  getImageDetails(id: string): void {
    this.ifbappService.getOneImages(id)
    .subscribe({
      next: data => {
        this.image = data;
        console.log(data);
      },
      error:error => {
        console.log(error);
      }}
    );
  }

  getImageData(id: string): void {
    this.ifbappService.getImageData(id)
    .subscribe({
      next: data => {
        this.imageData = data;
        console.log(data);
      },
      error:error => {
        console.log(error);
      }}
    );
  }

  goBack(): void {
    this.location.back()
  }
}
