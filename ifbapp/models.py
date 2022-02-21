from lzma import CHECK_SHA256
from django.db import models

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=30, blank=False, default="")
    description = models.CharField(max_length=200, blank=False, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
