from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from ifbapp.models import Project
from ifbapp.serializers import ProjectSerializer
from rest_framework.decorators import api_view
# Create your views here.

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

