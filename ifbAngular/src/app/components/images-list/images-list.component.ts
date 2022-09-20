import { Component, OnInit } from '@angular/core';
import { Image, Project, ImageDatapointMetadata, } from 'src/app/models/project.model';
import { IfbappService } from 'src/app/services/ifbapp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

function createImagesArray(originalArray: Array<any>, numberOfColumns : number): any {
  var arrayOfArrays: Array<Array<any>> = [];
  let numberOfRows = originalArray.length / numberOfColumns; 
  for(var i = 0; i < numberOfRows; i++) {
    arrayOfArrays.push(originalArray.slice(i * numberOfColumns , (i+1) * numberOfColumns))
  }
  return arrayOfArrays;
}

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.css']
})

export class ImagesListComponent implements OnInit {
  currentProject: Project = {
    id: '',
    name: '',
    description: ''
  };
  images?: Array<Array<Image>>;
  imagesArray?: [];
  currentImage: Image = {};

  filterExpression = '';
  
  // name = '';
  // message = '';
  project_id = "";

  // let imageFilters = new Map<string,

  imageFilters: ImageDatapointMetadata[];
  imageFiltersObject:Array<ImageDatapointMetadata> = [];
  imageFiltersBool: Array<ImageDatapointMetadata> = [];
  imageFiltersInt64: Array<ImageDatapointMetadata> = [];
  imageFiltersFloat64: Array<ImageDatapointMetadata> = [];


  // filtersToApply: { [variable: string] : filterCriteria; } = {};

  numberOfColumns =3;

  maxImageWidth = 200;


  constructor(
    private ifbappService: IfbappService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.maxImageWidth = window.innerWidth * 0.7 / this.numberOfColumns;
    // this.message = '';
    this.getProject(this.route.snapshot.params['projectId']);
    //console.log("Project id2: "+this.route.snapshot.params['projectId']);
    this.retrieveImages(this.route.snapshot.params['projectId']);

    this.retrieveFilters(this.route.snapshot.params['projectId']);
  }

  getProject(project_id: string): void {
    this.project_id = project_id
    this.ifbappService.getProjectDetails(project_id)
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


  
  retrieveImages(project_id: string): void {
    // function was here before
    
    this.ifbappService.getAllImages(project_id)
      .subscribe({
        next: data => {
          this.images = createImagesArray(data, this.numberOfColumns);
          console.log(data);
        },
        error: error => {
          console.log(error);
        }
      }
      );
  }

  retrieveFilters(project_id: string): void {
    function splitFiltersByType(that: any, data: any): any {
      for (let i = 0; i < data.length; i++) {
          console.log(data[i]);
          if (data[i].variable_type == "object") {
              that.imageFiltersObject.push(data[i]);
          } else if (data[i].variable_type == "bool") {
            that.imageFiltersBool.push(data[i]);          
          } else if (data[i].variable_type == "int64") {
            that.imageFiltersInt64.push(data[i]);          
          } else if (data[i].variable_type == "float64") {
            that.imageFiltersFloat64.push(data[i]);
          }
        }
          // Default values for filtsrs
      // for (let i = 0; i < that.imageFiltersObject.length; i++) {
      // //   that.filtersToApply[that.imageFiltersObject[i].variable] = {"value": ""}
      //   that.imageFiltersObject[i].value = ""
      // }

      return data;
    }
    this.ifbappService.getFilters(project_id)
      .subscribe({
        next: data => {
          this.imageFilters = splitFiltersByType(this, data);
          console.log(data);
          console.log(this.imageFiltersObject);
        },
        error: error => {
          console.log(error);
        }
      }
    );
  }
  // splitFiltersByType(): void {
  //   for (let i = 0; i < this.imageFilters.length; i++) {
  //       if (this.imageFilters[i].variable_type == "object") {
  //           this.imageFiltersObject.push(this.imageFilters[i]);
  //       } else if (this.imageFilters[i].variable_type == "bool") {
  //         this.imageFiltersBool.push(this.imageFilters[i]);          
  //       } else if (this.imageFilters[i].variable_type == "int64") {
  //         this.imageFiltersInt64.push(this.imageFilters[i]);          
  //       } else if (this.imageFilters[i].variable_type == "float64") {
  //         this.imageFiltersFloat64.push(this.imageFilters[i]);
  //       }
  //   }
  //   console.log(this.imageFiltersObject);   
  // }

  // retrieveFiltersOfType(project_id: string, var_type: string): void {
  //   this.ifbappService.getFiltersOfType(project_id, var_type)
  //     .subscribe({
  //       next: data => {
  //         this.imageFilters = data;
  //         console.log(data);
  //       },
  //       error: error => {
  //         console.log(error);
  //       }
  //     }
  //     );
    
  // }


  setActiveImage(image: Image): void {
    this.currentImage = image;
  }


  applyFilters(): void {
    this.filterExpression = '';
    for (let i = 0; i < this.imageFiltersObject.length; i++) {
      let currentFilter = this.imageFiltersObject[i]
      if (currentFilter.value) {
        if (this.filterExpression.length >0) this.filterExpression += ";"
        // this.filterExpression += "'"
        this.filterExpression += currentFilter.variable;
        this.filterExpression += "="
        this.filterExpression += currentFilter.value;
        // this.filterExpression += "'"
      }
    }
    for (let i = 0; i < this.imageFiltersBool.length; i++) {
      let currentFilter = this.imageFiltersBool[i]
      if (currentFilter.value=="True" || currentFilter.value=="False") {
        if (this.filterExpression.length >0) this.filterExpression += ";"
        this.filterExpression += currentFilter.variable;
        this.filterExpression += "="
        this.filterExpression += currentFilter.value;
      }
    }
    for (let i = 0; i < this.imageFiltersInt64.length; i++) {
      let currentFilter = this.imageFiltersInt64[i]
      if (currentFilter.min || currentFilter.max) {
        if (this.filterExpression.length >0) this.filterExpression += ";"
        this.filterExpression += currentFilter.variable;
        this.filterExpression += "="
        this.filterExpression += currentFilter.min;
        this.filterExpression += "^"
        this.filterExpression += currentFilter.max;
      }
    }
    for (let i = 0; i < this.imageFiltersFloat64.length; i++) {
      let currentFilter = this.imageFiltersFloat64[i]
      if (currentFilter.min || currentFilter.max) {
        if (this.filterExpression.length >0) this.filterExpression += ";"
        this.filterExpression += currentFilter.variable;
        this.filterExpression += "="
        this.filterExpression += currentFilter.min;
        this.filterExpression += "^"
        this.filterExpression += currentFilter.max;
      }
    }
    this.filterExpression += "#"
    console.log(this.filterExpression)
    
    // Querry to backed
    // this.currentProject = {};
    // this.currentIndex = -1;
    this.ifbappService.getFilteredImages(this.project_id, this.filterExpression)
      .subscribe({
        next: data => {
          this.images = createImagesArray(data, this.numberOfColumns);
          console.log(data);
        },
        error: error => {
          console.log(error);
        }
      }
      );

  }

  removeFilters(): void {
    this.filterExpression = '';
    this.imageFilters = [];
    this.imageFiltersObject = [];
    this.imageFiltersBool = [];
    this.imageFiltersInt64 = [];
    this.imageFiltersFloat64 = [];
    this.retrieveImages(this.route.snapshot.params['projectId']);
    this.retrieveFilters(this.route.snapshot.params['projectId']);
  }

}


