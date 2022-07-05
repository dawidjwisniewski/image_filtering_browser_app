export class Project {
    id?: any;
    name?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}
export class Image {
    id?: any;
    project_id?: any; 
    file_name?: string; 
    final_location?: string; 
    created_at?: string; 
    updated_at?: string; 
}

export class ImageDatapoint {
    id?: any;
    project_id?: any;
    file_name?: string;
    variable?: string;
    value?: string;
    created_at?: string;
    updated_at?: string;
}

export class ImageDatapointMetadata {
    id?: any;
    project_id?: any;
    variable?: string;
    variable_type?: string;
    min?: string;
    max?: string;
    created_at?: string;
    updated_at?: string;

    value?: string;
}

// export class filterCriteria {
//     value: string;
//     min: string;
//     max: string;
//   }