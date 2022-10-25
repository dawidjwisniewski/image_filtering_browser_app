import os, sys
from ifbapp.serializers import ImageSerializer
from django.http.response import JsonResponse
from rest_framework import status
from ifbapp.models import Image
from sqlalchemy import create_engine
from django.conf import settings
import pandas as pd

file_location = "./data/"
temp_file_location = f"{file_location}temp/"
angular_assets_location = "ifbAngular/src/"
angular_image_location_relative = "assets/project_images/"


def make_sure_folder_exists(path):
    if not os.path.exists(path): 
        os.makedirs(path)
  
def handle_uploaded_csv_file(project_id, file, images_list):
    
    # save original csv to temp location
    make_sure_folder_exists(temp_file_location)
    temp_location = f'{temp_file_location}/{project_id}.csv'
    with open(temp_location, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)

    temp_location = f'{temp_file_location}/{project_id}.csv'
    
    # import csv
    data = pd.read_csv(temp_location)

    # since all numbers are treated as int, let's convert binnnary variables into bool
    for column in data:
        if set(data[column].unique())=={0,1}:
            data[column] = data[column].astype(bool)

    # formad data for db upload
    now = pd.Timestamp.now()
    final_data = data.melt(id_vars=['file_name'], var_name='variable', value_name='value')
    final_data['value'] = final_data['value'].astype(str)
    # final_data['project_id'] = project_id
    final_data['created_at'] = now
    final_data['updated_at'] = now

    # calculate metadata information
    min_max = data.describe(include='all').loc[['min','max']].T
    variable_type = pd.DataFrame(data.dtypes, columns = ['variable_type'])
    
    # merge and formad data for db upload
    data_metadata = variable_type.merge(min_max, left_index=True, right_index=True)
    data_metadata = data_metadata.rename_axis('variable').reset_index().iloc[1:]
    data_metadata['variable_type'] = data_metadata['variable_type'].astype(str)
    data_metadata['project_id'] = project_id
    data_metadata['created_at'] = now
    data_metadata['updated_at'] = now

    # save to db
    user = settings.DATABASES['default']['USER']
    password = settings.DATABASES['default']['PASSWORD']
    database_name = settings.DATABASES['default']['NAME']
    host = settings.DATABASES['default']['HOST']
    port = settings.DATABASES['default']['PORT']

    database_url = f'postgresql://{user}:{password}@{host}:{port}/{database_name}'
    engine = create_engine(database_url, echo=False)

    # save metadata
    data_metadata.to_sql('ifbapp_imagedatapointmetadata', con=engine, if_exists = 'append', index=False)

    # save image data per image (since image is a foreign key)
    for image in images_list:
        data_for_one_image = final_data[final_data.file_name == image["file_name"]].drop('file_name', axis=1)
        if data_for_one_image.shape[0]==0:
            print(f"No data for file {image['file_name']}")
        else:
            data_for_one_image["image_id"]=image["id"]
            data_for_one_image.to_sql('ifbapp_imagedatapoint', con=engine, if_exists = 'append', index=False)

        # at this point it would be worth to create list images in the original CSV, remove from it the files that actually appear in the data
        # and at the end list files without data

    # move csv file to project location
    final_csv_location = f'{file_location}{project_id}'
    make_sure_folder_exists(final_csv_location)
    final_csv_location_with_filename = f'{final_csv_location}/rawdata.csv'
    os.rename(temp_location, final_csv_location_with_filename)

def handle_uploaded_image(project_id, file):
    
    angular_assets_location
    angular_image_location_relative


    # write file
    final_image_location = f'{angular_assets_location}{angular_image_location_relative}{project_id}'
    make_sure_folder_exists(final_image_location)
    file_name = file.name
    final_image_location_with_filename = f'{final_image_location}/{file_name}'
    with open(final_image_location_with_filename, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)

    # create database entry
    image_data = {
            'file_name': file_name,
            'final_location': f'{angular_image_location_relative}{project_id}/{file_name}',
        }
    image = Image(**image_data)
    image.project_id = project_id

    image.save()
