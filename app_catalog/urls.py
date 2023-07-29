from django.conf.urls import url, include
from django.urls import re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'category', CategoryViewSet)
router.register(r'product_view', ProductViewSet)
router.register(r'brand', BrandViewSet)
router.register(r'slide', SlideViewSet)

# custom apis
urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api/product/$', ProductView.as_view(), name='product'),
]
