"""logics URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import re_path
from django.conf.urls import include, url
from django.utils.translation import gettext as _
from django.views.generic import RedirectView
from rest_framework.authtoken import views

from app_general.views import CustomAuthToken

urlpatterns = [
    path('settings/', admin.site.urls),
    path('i18n/', include('django_translation_flags.urls')),
]

urlpatterns += [
    re_path(r'^app_transport_services/', include('app_transport_services.urls')),
    re_path(r'^app_general/', include('app_general.urls')),
    re_path(r'^app_application/', include('app_application.urls')),
    re_path(r'^app_component/', include('app_component.urls')),
    re_path(r'^app_catalog/', include('app_catalog.urls')),
    re_path(r'^app_purchase_order/', include('app_purchase_order.urls')),
    re_path(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path(r'^$', RedirectView.as_view(url='/settings'))
]

