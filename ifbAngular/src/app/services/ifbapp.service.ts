import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { UserService } from './user.service';
import { Image, ImageDatapoint, ImageDatapointMetadata, Project } from '../models/project.model';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
const baseUrl = 'http://localhost:8080/api/ifbapp';
const loginUrl = 'http://localhost:8080/api/token';


@Injectable({
  providedIn: 'root'
})
export class IfbappService {
  
  // http options used for making API calls
  private httpOptions: any;
  
  // the actual JWT token
  public token: string ='';
 
  // the token expiration date
  public token_expires: any;
 
  // the username of the logged in user
  public username: string = '';
 
  // error messages received from the login attempt
  public errors: any = [];
 
  constructor(
    private http: HttpClient,
    // private _userService: UserService
    ) { 
      // this.httpOptions = {
      //   headers: new HttpHeaders({'Content-Type': 'application/json'})
      // };
    }


  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(baseUrl);
  }
  getProjectDetails(id: any): Observable<Project> {
    return this.http.get<Project>(`${baseUrl}/${id}`);
  }
  createProject(data: any): Observable<any> {
    return this.http.post(baseUrl, data, this.httpOptions);
  }
  updateProject(id: any, data:any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, this.httpOptions);
  }
  deleteProject(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`, this.httpOptions);
  }
  findProjectByName(name: any): Observable<Project[]> {
    return this.http.get<Project[]>(`${baseUrl}?name=${name}`);
  }
  getAllImages(project_id: any): Observable<Image[]> {
    return this.http.get<Image[]>(`${baseUrl}/images/${project_id}`);
  }
  getOneImages(image_id: any): Observable<Image> {
    return this.http.get<Image>(`${baseUrl}/image/${image_id}`);
  }
  getFilters(project_id: any): Observable<ImageDatapointMetadata[]> {
    return this.http.get<ImageDatapointMetadata[]>(`${baseUrl}/imagesMetaData/${project_id}`);
  }
  getFiltersOfType(project_id: any, var_type: String): Observable<ImageDatapointMetadata[]> {
    return this.http.get<ImageDatapointMetadata[]>(`${baseUrl}/imagesMetaData/${project_id}?var_type=${var_type}`);
  }
  getSortedAndFilteredImages(project_id: any, sortAndFilterExpression:any): Observable<Image[]> {
    return this.http.get<Image[]>(`${baseUrl}/images/${project_id}?${sortAndFilterExpression}`);
  }

  getImageData(image_id: any): Observable<ImageDatapoint[]> {
    return this.http.get<ImageDatapoint[]>(`${baseUrl}/imagesData/${image_id}`);
  }

  addProjectDataCsv(id: any, formData: any): Observable<any> {
    // return this.http.post<any>(`${baseUrl}/uploadCSV/${id}`, formData)
    const req = new HttpRequest('POST', `${baseUrl}/uploadCSV/${id}`, formData, {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        //'Content-Type': 'multipart/form-data',
        'Authorization': 'JWT ' + this.token
      }),
      reportProgress: true,
      responseType: 'json',
      // withCredentials: true,
    });
    return this.http.request(req);
  }
  addProjectDataImage(id: any, formData: any): Observable<any> {
    // return this.http.post<any>(`${baseUrl}/uploadCSV/${id}`, formData)
    const req = new HttpRequest('POST', `${baseUrl}/images/${id}`, formData, {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        //'Content-Type': 'multipart/form-data',
        'Authorization': 'JWT ' + this.token
      }),
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }



  loginRequest(user: any): Observable<any> {
    return this.http.post(loginUrl, user, this.httpOptions);
  }
  refreshTokenRequest(token: any): Observable<any> {
    return this.http.post(`${loginUrl}/refresh`, token, this.httpOptions);
  }

  login(user: any): void {
    this.loginRequest(user)
      .subscribe({
        next: response => {
          this.updateData(response['token']);
          console.log(response);
        },
        error: error => {
          console.log(error);
        }}
      );
  }

  refreshToken(): void {
    this.refreshTokenRequest({'token': this.token})
    .subscribe({
      next: response => {
        this.updateData(response['token']);
        console.log(response);
      },
      error: error => {
        console.log(error);
      }}
    );
  }

    logout(): void {
    this.token = '';
    this.token_expires = null;
    this.username = '';
  }
 
  updateData(token: string): void {
    this.token = token;
    this.errors = [];

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.token
      })
    };
 
    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }

  // autentification
  // http options used for making API calls
  // private httpOptions: any;
 
  // // the actual JWT token
  // public token: string ='';
 
  // // the token expiration date
  // public token_expires: any;
 
  // // the username of the logged in user
  // public username: string = '';
 
  // // error messages received from the login attempt
  // public errors: any = [];
 
  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  // login(user: any): any {
  //   this.http.post(loginUrl, user)
  //     .subscribe({
  //       next: response => {
  //         this.token = response['token']);
  //         console.log(response);
  //       },
  //       error: error => {
  //         console.log(error);
  //       }}
  //     );
  // }
 
  // // Refreshes the JWT token, to extend the time the user is logged in
  // refreshToken(): void {
  //   return this.ifbappService.refreshToken({'token': this.token})
  //   .subscribe({
  //     next: response => {
  //       this.updateData(response['token']);
  //       console.log(response);
  //     },
  //     error: error => {
  //       console.log(error);
  //     }}
  //   );
  // }
 
  // logout(): void {
  //   this.token = '';
  //   this.token_expires = null;
  //   this.username = '';
  // }
 
}
