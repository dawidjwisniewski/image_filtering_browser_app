from rest_framework import serializers
from ifbapp.models import Image, Project

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
