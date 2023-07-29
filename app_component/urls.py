from django.conf.urls import url, include

from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'component', ComponentViewSet)
router.register(r'location', LocationViewSet)
router.register(r'type', TypeViewSet)
router.register(r'file', AttachedFilesViewSet)
router.register(r'workflow', WorkFlowViewSet)
router.register(r'component_location', ComponentLocationViewSet)
router.register(r'component_service_order', ComponentServiceOrderViewSet)

# custom apis
urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api/download_file/$', DownloadFile.as_view(), name='download_file'),
    url(r'^api/report/$', Report.as_view(), name='report'),
]
