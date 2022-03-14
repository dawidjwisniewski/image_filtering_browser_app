import os

temp_file_location = "./data/temp/"

def make_sure_folder_exists(path):
    if not os.path.exists(path): 
        os.makedirs(path)
  
def handle_uploaded_csv_file(project_id, file):
    make_sure_folder_exists(temp_file_location)
    temp_location = f'{temp_file_location}/{project_id}.csv'
    with open(temp_location, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
        original_name = file.name

def handle_uploaded_image(project_id, file):
    image_location = f'{temp_file_location}{project_id}'
    make_sure_folder_exists(image_location)
    original_name = file.name
    image_location_with_filename = f'{image_location}/{original_name}'
    with open(image_location_with_filename, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
        original_name = file.name