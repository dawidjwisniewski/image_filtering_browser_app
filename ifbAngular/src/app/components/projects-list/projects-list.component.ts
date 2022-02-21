import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { IfbappService } from 'src/app/services/ifbapp.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects?: Project[];
  currentProject: Project = {};
  currentIndex = -1;
  name = '';
  constructor(private ifbappService: IfbappService) { }

  ngOnInit(): void {
    this.retrieveProjects()
  }
  retrieveProjects(): void {
    this.ifbappService.getAllProjects()
      .subscribe({
        next: data => {
          this.projects = data;
          console.log(data);
        },
        error: error => {
          console.log(error);
        }
      }
      );
  }
  // refreshList(): void {
  //   this.retrieveProjects();
  //   this.currentProject = {};
  //   this.currentIndex = -1;
  // }
  setActiveProject(project: Project, index: number): void {
    this.currentProject = project;
    this.currentIndex = index;
  }
  searchName(): void {
    this.currentProject = {};
    this.currentIndex = -1;
    this.ifbappService.findProjectByName(this.name)
      .subscribe({
        next: data => {
          this.projects = data;
          console.log(data);
        },
        error: error => {
          console.log(error);
        }}
      );
  }
}
