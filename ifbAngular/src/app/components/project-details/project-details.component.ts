import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { IfbappService } from 'src/app/services/ifbapp.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  currentProject: Project = {
    name: '',
    description: ''
  };
  message = '';
  constructor(
    private ifbappService: IfbappService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
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
  updateProject(): void {
    this.message = '';
    this.ifbappService.updateProject(this.currentProject.id, this.currentProject)
      .subscribe({
        next: response => {
          console.log(response);
          this.message = response.message ? response.message : 'This project has been updated successfully!';
        },
        error: error => {
          console.log(error);
        }}
      );
  }
  deleteProject(): void {
    this.ifbappService.deleteProject(this.currentProject.id)
      .subscribe({
        next: response => {
          console.log(response);
          this.router.navigate(['/ifbapp']);
        },
        error: error => {
          console.log(error);
        }}
      );
  }
  
  
}
