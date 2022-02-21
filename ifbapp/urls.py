from django.urls import re_path
from ifbapp import views

urlpatterns = [
    re_path(r'^api/ifbapp$', views.project_list),
    re_path(r'^api/ifbapp/(?P<pk>[0-9]+)$', views.project_details)
]