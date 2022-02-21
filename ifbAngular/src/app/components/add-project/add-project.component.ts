import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { IfbappService } from 'src/app/services/ifbapp.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  project: Project = {
    name: '',
    description: '',
  }
  submitted = false;
  constructor(private ifbappService: IfbappService) { }

  ngOnInit(): void {
  }
  saveProject(): void {
    const data = {
      name: this.project.name,
      description: this.project.description,
    }
    this.ifbappService.createProject(data)
      .subscribe({
        next: response => {
          console.log(response);
          this.submitted = true;
        },
        error: error => {
          console.log(error);
        }}
      );
  }
  newProject(): void {
    this.submitted = false;
    this.project = {
      name: '',
      description: '',
    }
  }

}
