import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddProjectComponent } from './components/add-project/add-project.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { AddProjectDataComponent } from './components/add-project-data/add-project-data.component';
import { ImagesListComponent } from './components/images-list/images-list.component';
import { ImageDetailsComponent } from './components/image-details/image-details.component';

const routes: Routes = [
  {path: '', redirectTo: 'ifbapp', pathMatch: 'full'},
  {path: 'ifbapp', component: ProjectsListComponent},
  {path: 'ifbapp/addProject', component: AddProjectComponent},
  {path: 'ifbapp/editProject/:projectId', component: ProjectDetailsComponent},
  {path: 'ifbapp/addProjectData/:projectId', component: AddProjectDataComponent},
  {path: 'ifbapp/images/:projectId', component: ImagesListComponent},
  {path: 'ifbapp/image/:imageId', component: ImageDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
