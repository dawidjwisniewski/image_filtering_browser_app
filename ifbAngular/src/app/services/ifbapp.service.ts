import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
const baseUrl = 'http://localhost:8080/api/ifbapp';


@Injectable({
  providedIn: 'root'
})
export class IfbappService {
  constructor(private http: HttpClient) { }
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(baseUrl);
  }
  getProjectDetails(id: any): Observable<Project> {
    return this.http.get<Project>(`${baseUrl}/${id}`);
  }
  createProject(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  updateProject(id: any, data:any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
  deleteProject(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  findProjectByName(name: any): Observable<Project[]> {
    return this.http.get<Project[]>(`${baseUrl}?name=${name}`);
  }
}
