from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class AppComponentConfig(AppConfig):
    name = 'app_component'

    def ready(self):
        self.verbose_name = _('Component')
