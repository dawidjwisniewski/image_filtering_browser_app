import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddProjectComponent } from './components/add-project/add-project.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'ifbapp', pathMatch: 'full'},
  {path: 'ifbapp', component: ProjectsListComponent},
  {path: 'ifbapp/addProject', component: AddProjectComponent},
  {path: 'ifbapp/editProject/:projectId', component: ProjectDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
