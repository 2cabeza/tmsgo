from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class AppPurchaseOrderConfig(AppConfig):
    name = 'app_purchase_order'

    def ready(self):
        self.verbose_name = _('purchase order')
