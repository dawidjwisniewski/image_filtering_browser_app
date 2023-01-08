#from tkinter import Image
from tkinter import N
from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
import re

from ifbapp.models import ImageDatapoint, ImageDatapointMetadata, Project, Image
from ifbapp.serializers import ProjectSerializer, ImageSerializer, ImageDatapointSerializer, ImageDatapointMetadataSerializer
from rest_framework.decorators import api_view

from .handle_uploaded_files import handle_uploaded_csv_file, handle_uploaded_image

from django.db.models import FloatField, IntegerField, F, Value, Prefetch
from django.db.models.functions import Cast, RowNumber, Rank
from django.db.models.expressions import Window, RawSQL

@api_view(['GET', 'POST'])
def project_list(request):
    if request.method == 'GET':
        
        projects = Project.objects.all()

        name = request.GET.get('name', None)
        
        if name is not None:
            projects = projects.filter(name__icontains=name)

        projects_serializer = ProjectSerializer(projects, many=True)
        return JsonResponse(projects_serializer.data, safe=False)
    elif request.method == 'POST':
        
        project_data = JSONParser().parse(request)
        
        project_serializer = ProjectSerializer(data=project_data)
        
        if project_serializer.is_valid():
            project_serializer.save()
            return JsonResponse(project_serializer.data, status = status.HTTP_201_CREATED)
        
        else:
            return JsonResponse(project_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def project_details(request, pk):
    
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return JsonResponse({'message': "The project does not exist"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        project_serializer = ProjectSerializer(project)
        return JsonResponse(project_serializer.data)

    elif request.method == 'PUT':
        project_data = JSONParser().parse(request)
        project_serializer = ProjectSerializer(project, data=project_data)

        if project_serializer.is_valid():
            project_serializer.save()
            return JsonResponse(project_serializer.data)
            
        else:
            return JsonResponse(project_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        project.delete()
        return JsonResponse({'message': 'Project was deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def upload_csv_file(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return JsonResponse({'message': "The project does not exist"}, status=status.HTTP_404_NOT_FOUND)

    imagedata = ImageDatapoint.objects.filter(image__project__id=pk)
    imagedatametadata = ImageDatapointMetadata.objects.filter(project_id=pk)
    
    project_id = pk
    if request.method == 'POST':
        imagedata.delete()
        imagedatametadata.delete()

        # first get the list of files in the project that should appear in CSV
        list_of_images = Image.objects.filter(project__id=pk).values("file_name","id")
        print(list_of_images)

        handle_uploaded_csv_file(project_id,request.FILES['file'], list_of_images)
        return JsonResponse({'message': 'File upload successfull!'})
        # try:
        #     handle_uploaded_csv_file(project_id,request.FILES['file'])
        #     return JsonResponse({'message': 'File upload successfull!'})
        # except:
        #     return JsonResponse({'message': 'unknown error'}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
    else:
        form = UploadFileForm()
        return JsonResponse({'message': 'File upload failed - POST not sent'})

@api_view(['GET'])
def image_datapoints(request, pk):
    # try:
    #     project = Project.objects.get(pk=pk)
    # except Project.DoesNotExist:
    #     return JsonResponse({'message': "The project does not exist"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        
        image_datapoints = ImageDatapoint.objects.filter(image_id=pk)

        image_datapoints_serializer = ImageDatapointSerializer(image_datapoints, many=True)
        return JsonResponse(image_datapoints_serializer.data, safe=False)

@api_view(['GET'])
def project_images_datapoints(request, pk):
    # try:
    #     project = Project.objects.get(pk=pk)
    # except Project.DoesNotExist:
    #     return JsonResponse({'message': "The project does not exist"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        
        image_datapoints = ImageDatapoint.objects.filter(image__project_id=pk)

        additonal_valiables = request.GET.get('additional_variables', None) 
        
        if additonal_valiables:
            additonal_valiables_list = additonal_valiables.split(";")               
            image_datapoints = image_datapoints.filter(variable__in=additonal_valiables_list)

        image_datapoints_serializer = ImageDatapointSerializer(image_datapoints, many=True)
        return JsonResponse(image_datapoints_serializer.data, safe=False)


@api_view(['GET'])
def image_datapointmetadata(request, pk):
    # try:
    #     project = Project.objects.get(pk=pk)
    # except Project.DoesNotExist:
    #     return JsonResponse({'message': "The project does not exist"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':        
        image_datapointmetadata = ImageDatapointMetadata.objects.filter(project_id=pk)

        # var_type = request.GET.get('var_type', None)
        
        # if var_type is not None:
        #     image_datapointmetadata = image_datapointmetadata.filter(variable_type=var_type)

        image_datapointsmetadata_serializer = ImageDatapointMetadataSerializer(image_datapointmetadata, many=True)
        return JsonResponse(image_datapointsmetadata_serializer.data, safe=False)

@api_view(['GET', 'POST'])
def image_details(request, pk):
    try:
        image = Image.objects.get(pk=pk)
    except Image.DoesNotExist:
        return JsonResponse({'message': "The image does not exist"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return JsonResponse(ImageSerializer(image).data)

@api_view(['GET', 'POST'])
def image_list(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return JsonResponse({'message': "The project does not exist"}, status=status.HTTP_404_NOT_FOUND)

    project_id = pk
    images = Image.objects.filter(project_id=pk)

    if request.method == 'GET':
        
        image_datapoints = ImageDatapoint.objects.filter(image__project_id=pk)
        image_datapointmetadata = ImageDatapointMetadata.objects.filter(project_id=pk)

        sort_string = request.GET.get('sort', None) 
        filter_string = request.GET.get('filter', None) 

        if sort_string is not None:
            variable_name, sort_order = sort_string.split(";")            
            
            if sort_order == "DESC":
                sort_order_prefix = "-"
            else:
                sort_order_prefix = ""
                
            #filter based on value criteria depending oon variable type
            if variable_name == "file_name":
                images=images.order_by(sort_order_prefix+variable_name)
            else:
                curent_filter_image_datapoints = image_datapoints.filter(variable=variable_name)                
                data_type = list(image_datapointmetadata.filter(project_id=pk)\
                    .filter(variable=variable_name).values("variable_type"))[0].get("variable_type")
                
                if data_type in ["object","bool"]:                              
                    images=images.filter(imagedatapoint__variable=variable_name).order_by(sort_order_prefix+"imagedatapoint__value")
                elif data_type == "float64":
                    images=images.filter(imagedatapoint__variable=variable_name).annotate(value_cast=Cast("imagedatapoint__value", output_field=FloatField()))\
                            .order_by(sort_order_prefix+"value_cast")                        
                elif data_type == "int64":
                    images=images.filter(imagedatapoint__variable=variable_name).annotate(value_cast=Cast("imagedatapoint__value", output_field=IntegerField()))\
                        .order_by(sort_order_prefix+"value_cast")

        #filtering variables
        if filter_string is not None:
            # image_datapoints = ImageDatapoint.objects.filter(image__project_id=pk)
            # image_datapointmetadata = ImageDatapointMetadata.objects.filter(project_id=pk)

            filter_list = filter_string.split(";")

            for filter in filter_list:
                filter_array=re.split("[=^]", filter)
                variable_name = filter_array[0]
                
                #get type of variable from db
                data_type = list(image_datapointmetadata.filter(project_id=pk)\
                    .filter(variable=variable_name).values("variable_type"))[0].get("variable_type")
                
                #filter based on value criteria depending oon variable type
                if data_type in ["object","bool"]:
                    filter_criteria = {
                        "imagedatapoint__variable__iexact": filter_array[0],
                        "imagedatapoint__value__icontains": filter_array[1]
                    }                    
                    images=images.filter(**filter_criteria)
  

                elif data_type in ["float64", "int64"]:
                    curent_filter_image_datapoints = image_datapoints.filter(variable__iexact = filter_array[0])
                    
                    if data_type == "float64":
                        curent_filter_image_datapoints = curent_filter_image_datapoints.annotate(
                            value_cast=Cast('value', output_field=FloatField()))                    
                        filter_criteria = {
                            "value_cast__gte": float(filter_array[1]),
                            "value_cast__lte": float(filter_array[2])
                        }
                    elif data_type == "int64":
                        curent_filter_image_datapoints = curent_filter_image_datapoints.annotate(
                            value_cast=Cast('value', output_field=IntegerField()))                    
                        filter_criteria = {
                            "value_cast__gte": int(filter_array[1]),
                            "value_cast__lte": int(filter_array[2])
                        }

                    list_of_files_matching_filter = curent_filter_image_datapoints.filter(**filter_criteria).select_related("image").values("image_id")
                    images=images.filter(id__in=list_of_files_matching_filter)       


        image_serializer = ImageSerializer(images, many=True)
        return JsonResponse(image_serializer.data, safe=False)

    if request.method == 'POST':
        
        files = request.FILES.getlist('file')
        for file in files:
            duplicate_image_data =  images.filter(file_name=file.name)
            duplicate_image_data.delete()
            handle_uploaded_image(project_id,file)
        return JsonResponse({'message': 'File upload successfull!'})

        # try:
        #     handle_uploaded_images(project_id,request.FILES['file'])
        #     return JsonResponse({'message': 'File upload successfull!'})
        # except:
        #     return JsonResponse({'message': 'unknown error'}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
    else:
        form = UploadFileForm()
        return JsonResponse({'message': 'File upload failed - POST not sent'})
