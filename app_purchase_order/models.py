from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from model_utils.models import TimeStampedModel, SoftDeletableModel
from django.utils.translation import ugettext_lazy as _
from app_general.models import OrganizationRelatedModel
from logics.utils import prevent_recursion

STATUS = (
    ('pending', _('pending')),
    ('discrepancy', _('discrepancy')),
    ('completed', _('completed')),
)


class PurchaseOrder(TimeStampedModel, SoftDeletableModel, OrganizationRelatedModel):

    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('description'),
    )
    status = models.CharField(
        max_length=255,
        choices=STATUS,
        default='pending',
        verbose_name=_('status'))
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('purchase order')
        verbose_name_plural = _('purchase orders')

    def __str__(self):
        return "{}".format(self.id)


class PurchaseOrderDetail(TimeStampedModel, SoftDeletableModel):
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('purchase order')
    )
    code_1 = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name=_('code_1'))
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('description'),
    )
    quantity = models.IntegerField(
        blank=True,
        null=True,
        verbose_name=_('quantity'))
    price_1 = models.DecimalField(
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=2,
        verbose_name=_('price 1')
    )
    price_2 = models.DecimalField(
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=2,
        verbose_name=_('price 2')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('purchase order detail')
        verbose_name_plural = _('purchase order details')

    def __str__(self):
        return "{}".format(self.id)


class Reception(TimeStampedModel, SoftDeletableModel, OrganizationRelatedModel):
    company = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name=_('company'))
    patent = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name=_('patent'))
    driver = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name=_('driver'))
    status = models.CharField(
        max_length=255,
        choices=STATUS,
        default='pending',
        verbose_name=_('status'))
    observation = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('observation'),
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('reception')
        verbose_name_plural = _('receptions')

    def __str__(self):
        return "{}".format(self.id)


class ReceptionDetail(TimeStampedModel, SoftDeletableModel):
    reception = models.ForeignKey(
        Reception,
        on_delete=models.CASCADE,
        verbose_name=_('reception')
    )
    purchase_order_detail = models.ForeignKey(
        PurchaseOrderDetail,
        on_delete=models.CASCADE,
        verbose_name=_('purchase order detail')
    )
    quantity = models.IntegerField(
        blank=True,
        null=True,
        verbose_name=_('quantity'))
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('reception detail')
        verbose_name_plural = _('reception details')

    def __str__(self):
        return "{}".format(self.id)


class ImportFileOrderDetail(TimeStampedModel, SoftDeletableModel, OrganizationRelatedModel):
    file = models.FileField(
        upload_to=settings.RELATIVE_IMAGE_PATH,
        default='',
        verbose_name=_('file'))
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('purchase order')
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('description'),
    )
    uploaded = models.BooleanField(
        default=False,
        verbose_name=_('uploaded')
    )
    user_created = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('user created')
    )

    class Meta:
        verbose_name = _('import file')
        verbose_name_plural = _('import files')

    def __str__(self):
        return "{}".format(self.description)


@receiver(post_save, sender=ImportFileOrderDetail)
@prevent_recursion
def gen_import(sender, instance=None, created=False, **kwargs):
    """
    execute Import
    """
    print('created', created)
    if instance.uploaded is False:
        from app_purchase_order.task import import_products
        import_products(instance)

