from django.conf.urls import url, include

from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

# views apis
router.register(r'service_order', ServiceOrderViewSet)
router.register(r'equipment', EquipmentViewSet)
router.register(r'driver', DriverViewSet)
router.register(r'contract', ContractViewSet)
router.register(r'work_log_type', WorkLogTypeViewSet)
router.register(r'work_log', WorkLogViewSet)
router.register(r'cost_center', CostCenterViewSet)
router.register(r'service_order_type', ServiceOrderTypeViewSet)
router.register(r'cost_type', CostTypeViewSet)
router.register(r'service_cost', ServiceCostViewSet)
router.register(r'tracking', TrackingViewSet)
# custom apis
urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api/availability/$', Availability.as_view(), name='availability'),
    url(r'^api/statistics/$', Statistics.as_view(), name='statistics'),
]
