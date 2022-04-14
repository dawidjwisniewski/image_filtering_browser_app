from curses.ascii import NUL
from lzma import CHECK_SHA256
from django.db import models

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=30, blank=False, default="")
    description = models.CharField(max_length=200, blank=False, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Image(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=30, blank=False, default="")
    final_location = models.CharField(max_length=200, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ImageDatapoint(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=30, blank=False, default="")
    variable = models.CharField(max_length=30, blank=False, default="")
    value = models.CharField(max_length=1000, blank=False, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ImageDatapointMetadata(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    variable = models.CharField(max_length=30, blank=False, default="")
    variable_type = models.CharField(max_length=30, blank=False, default="")
    min = models.FloatField(blank=False, null = True, default=NUL)
    max = models.FloatField(blank=False, null = True, default=NUL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)