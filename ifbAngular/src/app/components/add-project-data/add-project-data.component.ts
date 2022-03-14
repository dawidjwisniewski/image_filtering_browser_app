import { Component, OnInit } from '@angular/core';
import { IfbappService } from 'src/app/services/ifbapp.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-project-data',
  templateUrl: './add-project-data.component.html',
  styleUrls: ['./add-project-data.component.css']
})
export class AddProjectDataComponent implements OnInit {
  
  csvProgress = 0;
  imageProgress = 0;

  currentProject: Project = {
    id: '',
    name: '',
    description: ''
  };

  csvFile?: File;

  imageFiles?: FileList;
  currentImageFile?: File;

  hasErrors?=false;
  
  constructor(private formBuilder: FormBuilder, 
    private ifbappService: IfbappService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this.getProject(this.route.snapshot.params['projectId']);
  }

  getProject(id: string): void {
    this.ifbappService.getProjectDetails(id)
    .subscribe({
      next: data => {
        this.currentProject = data;
        console.log(data);
      },
      error:error => {
        console.log(error);
      }}
    );
  }

  onCsvFileChange(event:any) {
    if (event.target.files.length > 0) {
      this.csvFile = event.target.files[0];
    }
  }

  submitCsv(): void{
    this.csvProgress = 0;
    if (this.csvFile) {
      const formData = new FormData();
      formData.append('file', this.csvFile);
      // this.ifbappService.addProjectDataCsv(this.currentProject.id, formData)
      this.ifbappService.addProjectDataCsv(this.currentProject.id, formData)
      .subscribe({
        next: (event:any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.csvProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            console.log(event);
            alert('Uploaded Successfully.');  
          } 
        },
        error: error => {
          console.log(error);
          this.csvFile = undefined;
        }}
      );
    }
  }  

  onImageFileChange(event:any) {
    if (event.target.files.length > 0) {
      this.imageFiles = event.target.files;
    }
  }

  submitImage(): void{
    this.imageProgress = 0;
    if (this.imageFiles) {


      // const file: File | null = this.imageFiles.item(0);
      // if (file) {
      //   this.currentImageFile = file;
      //   const formData = new FormData();
      //   formData.append('file', this.currentImageFile);
      //   this.ifbappService.addProjectDataImage(this.currentProject.id, formData){
      this.hasErrors = false;
      const numberOfImages = this.imageFiles.length;
      for (let i = 0; i < numberOfImages; i++) {
        const file: File | null = this.imageFiles[i];
        if (file) {
          this.currentImageFile = file;
          const formData = new FormData();
          formData.append('file', this.currentImageFile);
          this.ifbappService.addProjectDataImage(this.currentProject.id, formData)      
          .subscribe({
            next: (event:any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.imageProgress= Math.round(100 *((i+(event.loaded / event.total))/(numberOfImages +1)));
                this.ref.detectChanges();
                // this.imageProgress = Math.round(100 * ((i)/(numberOfImages)));
              } else if (event instanceof HttpResponse) {
                this.imageProgress= Math.round(100 * ((i+1)/(numberOfImages)));
                console.log('i:'+i+' progress:'+this.imageProgress+ ',' +event);
                this.ref.detectChanges();
              } 
            },
            error: error => {
              console.log(error);
              this.csvFile = undefined;
              this.hasErrors = true;
            }}
          );
        }
      }
      if (!this.hasErrors) {
        alert('Uploaded Successfully.');  
      }
    }  
  }
}
