from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class AppApplicationConfig(AppConfig):
    name = 'app_application'

    def ready(self):
        self.verbose_name = _('Application')
