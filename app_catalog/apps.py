from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class AppCatalogConfig(AppConfig):
    name = 'app_catalog'

    def ready(self):
        self.verbose_name = _('catalog')
