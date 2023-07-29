from django.conf.urls import url, include

from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'application', ApplicationViewSet)


urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api/list/$',
        ListView.as_view(),
        name='list'),
]
