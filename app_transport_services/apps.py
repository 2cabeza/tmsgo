from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class AppTransportServicesConfig(AppConfig):
    name = 'app_transport_services'

    def ready(self):
        self.verbose_name = _('Transport Services')
