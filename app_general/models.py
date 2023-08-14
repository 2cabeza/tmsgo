import json

import requests
from colorfield.fields import ColorField
from django.apps import apps
from django.contrib.auth.models import Group
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel, SoftDeletableModel
from requests import Response
from rest_framework.authtoken.models import Token
from django.contrib.postgres.fields import JSONField

from logics.settings import RELATIVE_IMAGE_PATH, RELATIVE_IMAGE_TEMP, PROJECT_APPS
from logics.utils import upload_file_sign, get_apps, get_model_fields, prevent_recursion

SEX = (
    ('M', _('male')),
    ('F', _('female')),
    ('U', _('undefined')),
)

INPUT_TYPE = (
    ('text', _('Text')),
    ('number', _('Number')),
    ('number+', _('Positive Number')),
    ('select', _('Select')),
    ('textarea', _('Textarea')),
    ('check', _('Check')),
    ('upload', _('Upload')),
    ('multiselect', _('Multiselect')),
    ('scanner_component', _('Scanner')),
    ('conditional', _('Conditional')),
)


class ApiMethodModel(models.Model):
    api_list = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_('api list')
    )
    api_context = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_('api context')
    )
    save_in_parent = models.BooleanField(
        default=False,
        null=True,
        verbose_name=_('save value in parent')
    )
    anchor_field = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('anchor field')
    )
    input_value = models.JSONField(
        null=True,
        blank=True,
        default=dict,
        verbose_name=_('input value'))
    filter = models.JSONField(
        null=True,
        blank=True,
        default=dict,
        verbose_name=_('filter')
    )
    exclude = models.JSONField(
        null=True,
        blank=True,
        default=dict,
        verbose_name=_('exclude')
    )
    item_adapter = models.TextField(
        null=True,
        blank=True,
        default=dict,
        verbose_name=_('item adapter')
    )

    class Meta:
        verbose_name = _('api method')
        verbose_name_plural = _('api methods')

    class Meta:
        abstract = True


class MetaModel(models.Model):
    key = models.CharField(
        max_length=100,
        verbose_name=_('key')
    )
    code = models.CharField(
        max_length=100,
        verbose_name=_('code')
    )
    value = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('value')
    )

    class Meta:
        verbose_name = _('meta')
        verbose_name_plural = _('meta')

    class Meta:
        abstract = True


class TerritorialOrganization(models.Model):

    version_code = models.CharField(
        verbose_name=_('version code'),
        unique=True,
        max_length=50)
    description = models.TextField(
        default='',
        blank=True,
        verbose_name=_('description'),
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active')
    )

    class Meta:
        verbose_name_plural = _('territorial organizations')

    def __str__(self):
        return "{} ({})".format(self.description, self.version_code)


class Region(models.Model):
    region = models.CharField(
        verbose_name=_('region'),
        max_length=100
    )
    code = models.CharField(
        verbose_name=_('code'),
        unique=True,
        max_length=50)
    capital = models.CharField(
        verbose_name=_('capital'),
        max_length=100
    )
    territorial_organization = models.ForeignKey(
        TerritorialOrganization,
        null=True,
        verbose_name=_('territorial organization'),
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name_plural = _('regions')

    def __str__(self):
        return "{} ({})".format(self.region, self.code)


class Province(models.Model):
    province = models.CharField(
        verbose_name=_('province'),
        max_length=100
    )
    region = models.ForeignKey(
        Region,
        null=True,
        verbose_name=_('region'),
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name_plural = _('provinces')

    def __str__(self):
        return "{}".format(self.province)


class Commune(models.Model):
    commune = models.CharField(
        verbose_name=_('commune'),
        max_length=100
    )
    province = models.ForeignKey(
        Province,
        null=True,
        # related_name='province',
        verbose_name=_('province'),
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name_plural = _('communes')

    def __str__(self):
        return "{} - {} {}".format(self.commune, _('region').upper(), self.province.region)


class Subsidiary(TimeStampedModel, SoftDeletableModel):
    name = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('name'))
    contact = models.TextField(
        default='',
        blank=True,
        verbose_name=_('contact'))
    image = models.ImageField(
        blank=True,
        null=True,
        verbose_name=_('image'),
        upload_to=settings.RELATIVE_IMAGE_PATH)
    commune = models.ForeignKey(
        Commune,
        null=True,
        blank=True,
        verbose_name=_('commune'),
        on_delete=models.CASCADE
    )
    address = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('address'))
    latitude = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        blank=True,
        null=True,
        verbose_name=_('latitude'))
    longitude = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        blank=True,
        null=True,
        verbose_name=_('longitude'))
    parent_subsidiary = models.ForeignKey(
        'Subsidiary',
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('parent subsidiary')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active')
    )

    class Meta:
        verbose_name = _('subsidiary')
        verbose_name_plural = _('subsidiaries')

    def __str__(self):
        return "{}".format(self.name)


class Organization(TimeStampedModel, SoftDeletableModel):
    name = models.CharField(
        max_length=80,
        blank=True,
        verbose_name=_('name'))
    code = models.CharField(
        max_length=80,
        blank=True,
        verbose_name=_('code'))
    logo = models.ImageField(
        upload_to=settings.RELATIVE_IMAGE_PATH,
        default='',
        blank=True,
        null=True,
        verbose_name=_('logo')
    )

    class Meta:
        verbose_name = _('organization')
        verbose_name_plural = _('organizations')

    def __str__(self):
        return "{}".format(self.name)


class OrganizationRelatedModel(models.Model):
    organization = models.ForeignKey(
        Organization,
        default=None,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        verbose_name=_('organization'))

    class Meta:
        abstract = True


class Provider(TimeStampedModel, SoftDeletableModel):
    name = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('name'))
    ni = models.IntegerField(
        blank=True,
        null=True,
        unique=True,
        default=None,
        verbose_name=_('identification number'))
    check_digit = models.CharField(
        max_length=1,
        blank=True,
        default='',
        verbose_name=_('check digit'))
    code = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('code'))
    description = models.TextField(
        default='',
        blank=True,
        verbose_name=_('description'))
    latitude = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        blank=True,
        null=True,
        verbose_name=_('latitude'))
    longitude = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        blank=True,
        null=True,
        verbose_name=_('longitude'))
    website = models.URLField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name=_('website'))
    color = ColorField(
        default='#EEEEEE',
        verbose_name=_('color'))
    email = models.EmailField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name=_('email'))
    contact_data = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('contact_data'))
    bank_account_data = models.TextField(
        default='',
        blank=True,
        verbose_name=_('bank account data'))
    image = models.ImageField(
        upload_to=settings.RELATIVE_IMAGE_PATH,
        default='',
        blank=True,
        null=True,
        verbose_name=_('image')
    )
    stamp = models.URLField(
        blank=True,
        null=True,
        verbose_name=_('stamp'))
    commune = models.ForeignKey(
        Commune,
        null=True,
        blank=True,
        verbose_name=_('commune'),
        on_delete=models.CASCADE
    )
    address = models.TextField(
        default='',
        blank=True,
        verbose_name=_('address'))
    parent_provider = models.ForeignKey(
        'Provider',
        blank=True,
        null=True,
        related_name='parent_provider_rel',
        on_delete=models.CASCADE,
        verbose_name=_('parent provider')
    )
    default_commission = models.IntegerField(
        default=0,
        verbose_name=_('default commission')
    )
    default_commission = models.IntegerField(
        default=0,
        verbose_name=_('default commission')
    )
    min_amount_service = models.IntegerField(
        default=0,
        verbose_name=_('minimum amount of service')
    )
    is_public = models.BooleanField(
        default=False,
        verbose_name=_('is public')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active')
    )

    class Meta:
        verbose_name = _('provider')
        verbose_name_plural = _('providers')

    def __str__(self):
        return "{}".format(self.name)


class UserProfile(TimeStampedModel, SoftDeletableModel, OrganizationRelatedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name=_('user')
    )
    image = models.ImageField(
        blank=True,
        null=True,
        upload_to=RELATIVE_IMAGE_TEMP,
        verbose_name=_('image')
    )
    provider = models.ForeignKey(
        Provider,
        blank=True,
        null=True,
        related_name='provider_rel',
        on_delete=models.CASCADE,
        verbose_name=_('provider')
    )
    ni = models.IntegerField(
        blank=True,
        null=True,
        default=None,
        verbose_name=_('identification number'))
    check_digit = models.CharField(
        max_length=1,
        blank=True,
        default='',
        verbose_name=_('check digit'))
    personal_email = models.EmailField(
        max_length=80,
        blank=True,
        default='',
        verbose_name=_('personal email'))
    personal_phone = models.CharField(
        max_length=20,
        default='',
        blank=True,
        verbose_name=_('personal phone'))
    sex = models.CharField(
        max_length=255,
        choices=SEX,
        default='U',
        verbose_name=_('sex')
    )

    class Meta:
        verbose_name = _('user profile')
        verbose_name_plural = _('user profiles')

    def __str__(self):
        index = self.user
        if self.ni:
            index = '{} ({})'.format(self.user.username, self.ni)
        return "{}".format(index)


class FieldsPermission(SoftDeletableModel):

    code = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_('code'))
    description = models.TextField(
        default='',
        blank=True,
        null=True,
        verbose_name=_('description'))
    group_edit = models.ManyToManyField(
        Group,
        related_name='group_edit',
        blank=True
    )
    group_view = models.ManyToManyField(
        Group,
        related_name='group_view',
        blank=True
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('fields permission')
        verbose_name_plural = _('field permissions')

    def __str__(self):
        return "{}".format(self.code)


class Process(OrganizationRelatedModel, SoftDeletableModel):
    
    module = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('module')
    )
    
    def __init__(self, *args, **kwargs):
        super(Process, self).__init__(*args, **kwargs)
        
        self._meta.get_field('module').choices = get_apps()


    
    workflow_name = models.CharField(
        max_length=100,
        default='workflow',
        blank=True,
        verbose_name=_('workflow name'))
    code = models.CharField(
        max_length=100,
        default='',
        blank=True,
        verbose_name=_('code'))
    description = models.TextField(
        default='',
        blank=True,
        verbose_name=_('description'))
    color = ColorField(
        default='#EEEEEE',
        verbose_name=_('color'))
    icon = models.CharField(
        max_length=60,
        default='',
        blank=True,
        verbose_name=_('icon'))
    order = models.IntegerField(
        default=0,
        null=True,
        verbose_name=_('order'))
    subsidiaries = models.ManyToManyField(
        Subsidiary,
        blank=True,
        verbose_name=_('subsidiaries'))
    viewers = models.ManyToManyField(
        Group,
        blank=True,
        related_name='viewers',
        verbose_name=_('viewers'))
    editors = models.ManyToManyField(
        Group,
        blank=True,
        related_name='editors',
        verbose_name=_('editors'))
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('process')
        verbose_name_plural = _('processes')
        unique_together = ('code', 'module', 'organization')

    def __str__(self):
        return "{} ({})".format(self.module, self.code)


class WorkflowValueModel(TimeStampedModel,
                         SoftDeletableModel,
                         MetaModel):

    process = models.ForeignKey(
        Process,
        on_delete=models.CASCADE,
        verbose_name=_('process')
    )
    editor_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('editor user')
    )
    context_type = models.IntegerField(
        db_index=True,
        verbose_name=_('context_type'))
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('workflow model')
        verbose_name_plural = _('workflows model')
        unique_together = ('process', 'key', 'context_type', 'is_removed')

    class Meta:
        abstract = True


class MetaDataProcess(WorkflowValueModel):

    class Meta:
        verbose_name = _('metadata process')
        verbose_name_plural = _('metadata process')

    def __str__(self):
        return "{} - {} ({})".format(self.process, self.key, self.code)


class FieldName(SoftDeletableModel, ApiMethodModel):
    process = models.ForeignKey(
        Process,
        on_delete=models.CASCADE,
        verbose_name=_('process')
    )
    type = models.CharField(
        max_length=250,
        choices=INPUT_TYPE,
        default='text',
        verbose_name=_('type'))
    key = models.CharField(
        max_length=250,
        default='',
        verbose_name=_('key'))
    value = models.CharField(
        max_length=150,
        default='',
        blank=True,
        verbose_name=_('value'))
    default_value = models.CharField(
        max_length=300,
        default='',
        blank=True,
        verbose_name=_('default value'))
    title = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('title'))
    text_selected_item = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('text of selected item'))
    css_class = models.TextField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('css class'))
    column_attr = models.JSONField(
        null=True,
        blank=True,
        default=dict,
        verbose_name=_('column attributes'))
    conditions = models.JSONField(
        null=True,
        blank=True,
        default=dict,
        verbose_name=_('conditions'))
    icon = models.CharField(
        max_length=60,
        default='',
        blank=True,
        verbose_name=_('icon'))
    order = models.IntegerField(
        default='0',
        null=True,
        blank=True,
        verbose_name=_('order'))
    is_visible = models.BooleanField(
        default=True,
        verbose_name=_('is visible'))

    class Meta:
        verbose_name = _('fields name')
        verbose_name_plural = _('field names')
        unique_together = ('process', 'key')

    def __str__(self):
        return "{} ({})".format(self.process, self.key)


class Orders(SoftDeletableModel):
    quantity = models.CharField(
        max_length=120,
        blank=True,
        null=True,
        verbose_name=_('quantity'))
    create_data = models.CharField(
        max_length=120,
        default=None,
        blank=True,
        null=True,
        editable=True,
        verbose_name=_('create data'))
    version = models.CharField(
        max_length=120,
        default='',
        blank=True,
        verbose_name=_('version'))
    str_date = models.CharField(
        max_length=120,
        default=None,
        blank=True,
        null=True,
        editable=True,
        verbose_name=_('str date'))
    str_state = models.CharField(
        max_length=120,
        default=None,
        blank=True,
        null=True,
        editable=True,
        verbose_name=_('str state'))
    ticket = models.CharField(
        max_length=300,
        default=None,
        blank=True,
        null=True,
        editable=True,
        verbose_name=_('ticket'))

    class Meta:
        verbose_name = _('order')
        verbose_name_plural = _('orders')

    def __str__(self):
        return "{} {}".format(self.str_date, self.str_state)


class OrdersItem(SoftDeletableModel):
    order = models.ForeignKey(
        Orders,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('order')
    )
    code = models.CharField(
        max_length=120,
        blank=True,
        null=True,
        verbose_name=_('code'))
    name = models.TextField(
        max_length=250,
        default='workflow',
        blank=True,
        verbose_name=_('name'))
    code_state = models.CharField(
        max_length=120,
        default='',
        blank=True,
        verbose_name=_('code state'))

    class Meta:
        verbose_name = _('order item')
        verbose_name_plural = _('order items')

    def __str__(self):
        return "{}".format(self.id)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
@prevent_recursion
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """
    AutoToken
    """
    if created:
        # create token
        Token.objects.create(user=instance)
        # create user profile
        UserProfile.objects.create(user=instance)
    else:
        try:
            user_profile, created = UserProfile.objects.get_or_create(user=instance)
            if user_profile:
                if not user_profile.personal_email and user_profile.personal_email == "":
                    if instance.email:
                        user_profile.personal_email = instance.email
                        user_profile.save()
        except Exception as ex:
            print(ex)


@receiver(post_save, sender=Orders)
@prevent_recursion
def create_orders(sender, instance=None, created=False, **kwargs):
    """
    AutoToken
    """
    if created:
        # 10022021
        # aceptada
        # CD623554-7585-4416-A5D0-ED90600149FC
        url = 'http://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?fecha={}&estado={}&ticket={}'.format(instance.str_date, instance.str_state, instance.ticket)
        print('urk', url)
        headers = {
            'Content-Type': 'application/json'
        }
        try:
            response = requests.get(url, headers=headers)
            response = response.json()
            print('response', response.get('Cantidad'))
            instance.quantity = response.get('Cantidad')
            instance.create_data = response.get('FechaCreacion')
            instance.version = response.get('Version')
            instance.save()
            list = response.get('Listado')
            for item in list:
                print('order', item)
                OrdersItem.objects.create(order_id=instance.id, code=item.get('Codigo'), name=item.get('Nombre'), code_state=item.get('CodigoEstado'))
        except Exception as ex:
            print(ex)


post_save.connect(upload_file_sign, sender=UserProfile)





