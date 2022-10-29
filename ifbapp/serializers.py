from rest_framework import serializers
from ifbapp.models import Image, Project, ImageDatapoint, ImageDatapointMetadata

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            'id',
            'name',
            'description',
            'created_at',
            'updated_at',
        )
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = (
            'id',
            'project',
            'file_name',
            'final_location',
            'created_at',
            'updated_at',
        )

class ImageDatapointSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageDatapoint
        fields = (
            # 'project', 
            'id',
            'image',
            # 'file_name', 
            'variable', 
            'value', 
            'created_at', 
            'updated_at', 
        )

class ImageDatapointMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageDatapointMetadata
        fields = (
            'project',
            'variable',
            'variable_type',
            'min',
            'max',
            'created_at',
            'updated_at',
        )