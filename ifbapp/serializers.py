from rest_framework import serializers
from ifbapp.models import Project

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
