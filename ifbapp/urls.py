from django.urls import re_path, path, include
from ifbapp import views

from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token


urlpatterns = [
    #authentification
    path('api/token', obtain_jwt_token),
    path('api/token/refresh', refresh_jwt_token),

    #handling projects    
    re_path(r'^api/ifbapp$', views.project_list),
    re_path(r'^api/ifbapp/(?P<pk>[0-9]+)$', views.project_details),
    
    #addomg data
    re_path(r'^api/ifbapp/uploadCSV/(?P<pk>[0-9]+)$', views.upload_csv_file),
    re_path(r'^api/ifbapp/uploadImages/(?P<pk>[0-9]+)$', views.upload_images),
]