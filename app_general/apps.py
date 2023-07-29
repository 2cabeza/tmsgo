from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class AppGeneralConfig(AppConfig):
    name = 'app_general'

    def ready(self):
        self.verbose_name = _('General')

