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
    # sort_order = models.IntegerField(blank=True, default=99999)

    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(
    #             fields=['project', 'file_name'], 
    #             name='unique_image'
    #         )
    # ]

class ImageDatapointMetadata(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    variable = models.CharField(max_length=30, blank=False, default="")
    variable_type = models.CharField(max_length=30, blank=False, default="")
    min = models.FloatField(blank=False, null = True, default=NUL)
    max = models.FloatField(blank=False, null = True, default=NUL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ImageDatapoint(models.Model):
    # project = models.ForeignKey(Image, to_field='project', on_delete=models.CASCADE) #try1 - did not work as expected
    # project = models.ForeignKey(Project, on_delete=models.CASCADE) - commented when adding image as forren key (image is associated with single project)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    # file_name = models.CharField(max_length=30, blank=False, default="")  - commented when adding image as forren key
    # file_name = models.ManyToManyField(Image, to_field='file_name') #try2 - also did not work
    # file_name = models.ForeignKey(Image, to_field='file_name', on_delete=models.CASCADE) #try1 - did not work as expected
    variable = models.CharField(max_length=30, blank=False, default="")
    # variable = models.ForeignKey(ImageDatapointMetadata, on_delete=models.CASCADE) #try1 - did not work as expected
    value = models.CharField(max_length=10000, blank=False, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(
    #             fields=['project', 'file_name', 'variable'], 
    #             name='unique_image_variable'
    #         )
    # ]