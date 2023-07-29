from django.conf.urls import url, include

from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
# views apis


# custom apis
urlpatterns = [
    url(r'^api/', include(router.urls)),
]
