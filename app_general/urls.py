from django.conf.urls import url, include

from rest_framework import routers

from app_component.views import Report
from .views import *

router = routers.DefaultRouter()
# views apis
router.register(r'subsidiary', SubsidiaryViewSet)
router.register(r'profile', MyProfileViewSet)
router.register(r'metadata', MetaDataProcessViewSet)
router.register(r'provider', ProviderViewSet)

# custom apis
urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api/api-token-auth/$', CustomAuthToken.as_view(), name='api-token-auth'),
    url(r'^api/send/$', SendMail.as_view(), name='send-mail'),
    url(r'^api/iptv/$', Iptv.as_view(), name='iptv'),
]
