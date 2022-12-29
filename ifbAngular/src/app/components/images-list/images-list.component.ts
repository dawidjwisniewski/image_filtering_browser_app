import { Component, OnInit } from '@angular/core';
import { Image, Project, ImageDatapointMetadata, ImageDatapoint} from 'src/app/models/project.model';
import { IfbappService } from 'src/app/services/ifbapp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';;

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
  sortExpression = '';

  sortVariable = 'file_name';
  sortOrder = 'ASC'
  imageVariables = ['file_name'];
  
  
  // name = '';
  // message = '';
  project_id = "";

  // let imageFilters = new Map<string,

  imageFilters: ImageDatapointMetadata[];
  imageFiltersObject:Array<ImageDatapointMetadata> = [];
  imageFiltersBool: Array<ImageDatapointMetadata> = [];
  imageFiltersInt64: Array<ImageDatapointMetadata> = [];
  imageFiltersFloat64: Array<ImageDatapointMetadata> = [];

  imageData?: Array<ImageDatapoint>; 
  // additionalVariables? = ['Type', "Age"];
  variableValuesVisibility = new Map<any, boolean>();
  additionalVariablesExpression = "";
  // filtersToApply: { [variable: string] : filterCriteria; } = {};

  numberOfColumns =5;

  maxImageWidth = 200;


  constructor(
    private ifbappService: IfbappService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.message = '';
    this.getProject(this.route.snapshot.params['projectId']);
    //console.log("Project id2: "+this.route.snapshot.params['projectId']);
    this.retrieveImages(this.route.snapshot.params['projectId']);

    this.retrieveFilters(this.route.snapshot.params['projectId']);

    this.getProjectImagesData(this.route.snapshot.params['projectId']);
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
    this.maxImageWidth = window.innerWidth * 0.6 / this.numberOfColumns;

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
      that.imageVariables = ['file_name'];
      that.variableValuesVisibility.set('file_name', false)
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
          that.imageVariables.push(data[i].variable)
          that.variableValuesVisibility.set(data[i].variable, false)
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
    // this.filterExpression = 'sortBy='+this.sortVariable+"^"+this.sortDescending;
    
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
    // this.filterExpression += "#"
    console.log(this.filterExpression)
    
    // Querry to backed
    // this.currentProject = {};
    // this.currentIndex = -1;
    // this.ifbappService.getFilteredImages(this.project_id, this.filterExpression)
    //   .subscribe({
    //     next: data => {
    //       this.images = createImagesArray(data, this.numberOfColumns);
    //       console.log(data);
    //     },
    //     error: error => {
    //       console.log(error);
    //     }
    //   }
    //   );
    
    this.retrieveImagesUniversal()  

  }

  applySort():void{
    this.sortExpression = this.sortVariable+";"+this.sortOrder
    this.retrieveImagesUniversal()  
  }

  retrieveImagesUniversal():void {
    
    // construct sort and filter querry to pass as one string
    let sortAndFilterExpression='';
    if (this.sortExpression != '') {
      sortAndFilterExpression += "sort="
      sortAndFilterExpression += this.sortExpression
    }
    if (this.filterExpression != '') {
      if (sortAndFilterExpression != '') {
        sortAndFilterExpression += "&"
      }
      sortAndFilterExpression += "filter="
      sortAndFilterExpression += this.filterExpression
    }

    // main call to backend
    this.ifbappService.getSortedAndFilteredImages(this.project_id, sortAndFilterExpression)
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
    this.retrieveImagesUniversal()
    this.retrieveFilters(this.route.snapshot.params['projectId']);
  }

  getProjectImagesData(project_id: string): void {
    this.ifbappService.getProjectImagesData(project_id, this.additionalVariablesExpression)
    .subscribe({
      next: data => {
        this.imageData = data;
        console.log(data);
        // console.log("here goes the filtered image:")
        // console.log(this.imageData.filter(s => s.variable == "Type"))
        // console.log(this.imageData.filter(s => s.image == 158).filter(s => s.variable == "Type"))
      },
      error:error => {
        console.log(error);
      }}
    );
    
  }

  getValue(imageId : any, addVar: string): any{    
    let result: any = this.imageData?.filter(s => s.image == imageId).filter(s => s.variable == addVar)
    if (result.length>0){
      return result[0].value
    }
    else {
      return "NA"
    }
  }

  changeVariableValueVisibility(variable: any): void {
    if (this.variableValuesVisibility.get(variable) == false) {
      this.variableValuesVisibility.set(variable, true)
    } else {
      this.variableValuesVisibility.set(variable, false)      
    }
  }

}


