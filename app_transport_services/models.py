import datetime

from colorfield.fields import ColorField
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel, SoftDeletableModel
from app_general.models import *
from logics.utils import *

PLACES = (
    ('1', _('first')),
    ('2', _('second')),
    ('3', _('third')),
    ('4', _('fourth')),
    ('5', _('fifth')),
    ('6', _('sixth')),
    ('7', _('seventh')),
)


class Contract(TimeStampedModel, SoftDeletableModel):
    code = models.CharField(
        max_length=80,
        blank=True,
        verbose_name=_('code'))
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('description'))
    min_number_services = models.IntegerField(
        blank=True,
        null=True,
        verbose_name=_('min number services'))
    number_services_days = models.IntegerField(
        blank=True,
        null=True,
        verbose_name=_('number services days'))

    class Meta:
        verbose_name = _('contract')
        verbose_name_plural = _('contracts')

    def __str__(self):
        return "{}".format(self.code)


class Brand(SoftDeletableModel):
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_('name'))
    code = models.CharField(
        max_length=80,
        unique=True,
        verbose_name=_('code'))

    class Meta:
        verbose_name = _('brand')
        verbose_name_plural = _('brands')

    def __str__(self):
        return "{} - ({})".format(self.name, self.code)


class EquipmentType(TimeStampedModel, SoftDeletableModel):
    name = models.CharField(
        max_length=80,
        blank=True,
        unique=True,
        verbose_name=_('name'))
    code = models.CharField(
        max_length=80,
        blank=True,
        null=True,
        unique=True,
        verbose_name=_('code'))

    class Meta:
        verbose_name = _('equipment type')
        verbose_name_plural = _('type of equipments')

    def __str__(self):
        return "{}".format(self.name)


class Model(SoftDeletableModel):
    name = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('name'))
    code = models.CharField(
        max_length=80,
        blank=True,
        verbose_name=_('code'))
    max_weight = models.DecimalField(
        default=0.0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        help_text=_('kg'),
        verbose_name=_('max weight'))
    max_volume = models.DecimalField(
        default=0.0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        help_text=_('m3'),
        verbose_name=_('max volume'))
    efficiency = models.DecimalField(
        default=0.0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=2,
        help_text=_('km * lt'),
        verbose_name=_('efficiency'))
    brand = models.ForeignKey(
        Brand,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('brand')
    )
    type = models.ForeignKey(
        EquipmentType,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('type')
    )

    class Meta:
        verbose_name = _('model')
        verbose_name_plural = _('model')

    def __str__(self):
        brand = ''
        type_ = ''
        if self.brand:
            brand = self.brand.name
            if self.type:
                type_ = '(' + self.type.name + ')'
        return "{} - {} {}".format(brand, self.name, type_)


class Equipment(TimeStampedModel, SoftDeletableModel):
    patent = models.CharField(
        max_length=80,
        blank=True,
        null=True,
        verbose_name=_('patent'))
    circulation_permit_date = models.DateField(
        default=None,
        blank=True,
        null=True,
        editable=True,
        verbose_name=_('circulation permit date')
    )
    type = models.ForeignKey(
        EquipmentType,
        blank=True,
        on_delete=models.CASCADE,
        verbose_name=_('equipment type')
    )
    model = models.ForeignKey(
        Model,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('model')
    )
    contracts = models.ManyToManyField(
        Contract,
        blank=True,
        verbose_name=_('contract')
    )

    class Meta:
        verbose_name = _('equipment')
        verbose_name_plural = _('equipments')

    def __str__(self):
        return "{}".format(self.patent)


class Driver(TimeStampedModel, SoftDeletableModel):
    user_profile = models.ForeignKey(
        UserProfile,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('user profile')
    )
    license_date = models.DateField(
        default=None,
        blank=True,
        null=True,
        editable=True,
        verbose_name=_('license date')
    )
    contracts = models.ManyToManyField(
        Contract,
        blank=True,
        verbose_name=_('contract')
    )

    class Meta:
        verbose_name = _('driver')
        verbose_name_plural = _('drivers')

    def __str__(self):
        return "{}".format(self.user_profile)


class CostCenter(TimeStampedModel, SoftDeletableModel):
    name = models.CharField(
        max_length=120,
        blank=True,
        default='',
        verbose_name=_('name'))
    address = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('address'))
    contact = models.CharField(
        max_length=120,
        blank=True,
        default='',
        verbose_name=_('contact'))

    class Meta:
        verbose_name = _('cost center')
        verbose_name_plural = _('centers of costs')

    def __str__(self):
        return "{}".format(self.name)


class ServiceOrderType(SoftDeletableModel):
    name = models.CharField(
        max_length=80,
        blank=True,
        unique=True,
        verbose_name=_('name'))
    code = models.CharField(
        max_length=80,
        blank=True,
        null=True,
        unique=True,
        verbose_name=_('code'))
    color = ColorField(
        default='#EEEEEE',
        verbose_name=_('color'))

    class Meta:
        verbose_name = _('service order type')
        verbose_name_plural = _('type of services')

    def __str__(self):
        return "{}".format(self.name)


class ServiceOrder(TimeStampedModel, SoftDeletableModel):
    service_date = models.DateTimeField(
        default=None,
        blank=True,
        null=True,
        editable=True,
        verbose_name=_('service date'))
    provider = models.ForeignKey(
        Provider,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('provider'))
    type = models.ForeignKey(
        ServiceOrderType,
        blank=True,
        null=True,
        related_name='service_order_type',
        on_delete=models.CASCADE,
        verbose_name=_('type'))
    cost_center = models.ForeignKey(
        CostCenter,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('cost center'))
    contract = models.ForeignKey(
        Contract,
        blank=True,
        null=True,
        default=None,
        on_delete=models.CASCADE,
        verbose_name=_('contract'))
    address = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('address'))
    address_lat_long = models.CharField(
        max_length=100,
        default='',
        blank=True,
        verbose_name=_('address latitude and longitude'))
    office_guide = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('office guide'))
    reference = models.CharField(
        max_length=250,
        default='',
        blank=True,
        verbose_name=_('reference'))
    amount = models.BigIntegerField(
        default=0,
        blank=True,
        null=True,
        verbose_name=_('amount'))
    estimated_closing_date = models.DateTimeField(
        default=None,
        blank=True,
        null=True,
        verbose_name=_('estimated closing date'))
    priority = models.BooleanField(
        default=False,
        blank=True,
        verbose_name=_('priority'))
    weight = models.DecimalField(
        default=0.0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        help_text=_('kg'),
        verbose_name=_('weight'))
    volume = models.DecimalField(
        default=0.0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        help_text=_('m3'),
        verbose_name=_('volume'))
    origin = models.ForeignKey(
        Subsidiary,
        blank=True,
        null=True,
        related_name='origin',
        on_delete=models.CASCADE,
        verbose_name=_('origin')
    )
    destination = models.ForeignKey(
        Subsidiary,
        blank=True,
        null=True,
        related_name='destination',
        on_delete=models.CASCADE,
        verbose_name=_('destination')
    )
    user_created = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('user created')
    )
    is_loaded = models.BooleanField(
        default=False,
        verbose_name=_('is loaded'))
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))
    class Meta:
        verbose_name = _('service order')
        verbose_name_plural = _('order of services')

    def __str__(self):
        init = ''
        if self.id:
            init = '#' + str(self.id)
        return "{}".format(init)
    

    def get_status(self):
        status = Status.PENDING

        init = WorkLog.objects.filter(service_order=self, type__id=1).last()
        close = WorkLog.objects.filter(service_order=self, type__id=2).last()

        if self.service_date:
            # pending
            if datetime.strptime(str(datetime.now())[:19], '%Y-%m-%d %H:%M:%S') \
                    < datetime.strptime(str(self.service_date)[:19], '%Y-%m-%d %H:%M:%S'):
                status = Status.PENDING
            # overdue
            if (str(datetime.now())[:19], '%Y-%m-%d %H:%M:%S') \
                    > (str(self.service_date)[:19], '%Y-%m-%d %H:%M:%S'):
                status = Status.OVERDUE
            # in process | closed
            if init:
                if init.created:
                    status = Status.IN_PROCESS
                    if close:
                        status = Status.FINISHED
            if not self.is_active:
                status = Status.CANCELLED

        return status.value

    def __str__(self):
        return "{}".format(self.id)


class DriverServiceOrder(TimeStampedModel, SoftDeletableModel):
    service_order = models.ForeignKey(
        ServiceOrder,
        on_delete=models.CASCADE,
        verbose_name=_('service order')
    )
    driver = models.ForeignKey(
        Driver,
        blank=True,
        on_delete=models.CASCADE,
        verbose_name=_('driver')
    )
    type = models.CharField(
        max_length=255,
        choices=PLACES,
        default=1,
        verbose_name=_('type place')
    )

    class Meta:
        verbose_name = _('driver by service order')
        verbose_name_plural = _('driver by order of services')

    def __str__(self):
        return "{}".format(self.driver)


class EquipmentServiceOrder(TimeStampedModel, SoftDeletableModel):
    service_order = models.ForeignKey(
        ServiceOrder,
        on_delete=models.CASCADE,
        verbose_name=_('service order')
    )
    equipment = models.ForeignKey(
        Equipment,
        blank=True,
        on_delete=models.CASCADE,
        verbose_name=_('equipment')
    )
    type = models.CharField(
        max_length=255,
        choices=PLACES,
        default=1,
        verbose_name=_('type place')
    )

    class Meta:
        verbose_name = _('equipment by service order')
        verbose_name_plural = _('equipment by order of services')

    def __str__(self):
        return "{}".format(self.equipment)


class WorkLogType(TimeStampedModel, SoftDeletableModel):
    name = models.CharField(
        max_length=120,
        blank=True,
        default='',
        verbose_name=_('name'))
    code = models.CharField(
        max_length=50,
        blank=True,
        default='',
        verbose_name=_('code'))

    class Meta:
        verbose_name = _('work log type')
        verbose_name_plural = _('work logs types')

    def __str__(self):
        return "{}".format(self.name)


class CostType(SoftDeletableModel):
    code = models.CharField(
        max_length=120,
        unique=True,
        verbose_name=_('code'))
    name = models.CharField(
        max_length=120,
        unique=True,
        verbose_name=_('name'))
    color = ColorField(
        default='#EEEEEE',
        verbose_name=_('color'))
    has_double_value = models.BooleanField(
        default=False,
        verbose_name=_('has double value')
    )
    order = models.IntegerField(
        default=0,
        verbose_name=_('order'))

    class Meta:
        verbose_name = _('cost type')
        verbose_name_plural = _('cost types')

    def __str__(self):
        return "{} ({})".format(self.name, self.code)


class ServiceCost(TimeStampedModel, SoftDeletableModel):
    equipment = models.ForeignKey(
        Equipment,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('equipment')
    )
    service_order = models.ForeignKey(
        ServiceOrder,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('service order')
    )
    cost_type = models.ForeignKey(
        CostType,
        on_delete=models.CASCADE,
        verbose_name=_('cost type')
    )
    value1 = models.DecimalField(
        default=0.0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=0,
        help_text=_('$ pesos'),
        verbose_name=_('value 1'))
    value2 = models.DecimalField(
        default=0.0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=2,
        verbose_name=_('value 2 '))
    image = models.URLField(
        default='',
        blank=True,
        null=True,
        verbose_name=_('image')
    )
    observation = models.TextField(
        blank=True,
        default='',
        verbose_name=_('observation'))
    user_created = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('user created')
    )

    class Meta:
        verbose_name = _('service cost')
        verbose_name_plural = _('service costs')

    def __str__(self):
        return "{}".format(self.service_order)


class WorkLog(TimeStampedModel, SoftDeletableModel):
    service_order = models.ForeignKey(
        ServiceOrder,
        blank=True,
        on_delete=models.CASCADE,
        verbose_name=_('service order')
    )
    type = models.ForeignKey(
        WorkLogType,
        blank=True,
        on_delete=models.CASCADE,
        verbose_name=_('type')
    )
    value = models.CharField(
        max_length=120,
        blank=True,
        default='',
        verbose_name=_('value'))
    description = models.TextField(
        blank=True,
        default='',
        verbose_name=_('description'))
    user_created = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('user created')
    )

    class Meta:
        verbose_name = _('work log')
        verbose_name_plural = _('work logs')

    def __str__(self):
        return "{}".format(self.service_order)


class Tracking(TimeStampedModel, SoftDeletableModel):
    service_order = models.OneToOneField(
        ServiceOrder,
        on_delete=models.CASCADE,
        verbose_name=_('service order')
    )
    latitude = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        null=True,
        verbose_name=_('latitude'))
    longitude = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        null=True,
        verbose_name=_('longitude'))
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('user')
    )

    class Meta:
        verbose_name = _('tracking')
        verbose_name_plural = _('tracking')

    def __str__(self):
        return "{}".format(self.service_order)


@receiver(post_save, sender=MetaDataProcess)
@prevent_recursion
def post_save_meta_data(sender, instance=None, created=False, **kwargs):
    """
    Post Save Metadata Process
    """
    print('post save meta data')
    try:
        # meta = Process.objects.filter(module='app_component.component')
        print('meta data', instance.process.module)
        if instance.process.module == 'app_transport_services.serviceorder':
            field = FieldName.objects.get(process=instance.process,
                                          key=instance.key,
                                          save_in_parent=True)
            print('field', field.type)
            if field.type == 'select':
                _value = json.loads(instance.value)
                # filter params: ex: id=1
                kwargs_filter = {
                    field.anchor_field: instance.context_type
                }
                # update params: ex: provider_id=1
                kwargs = {
                    instance.key + '_id': _value.get('id')
                }
                print('kwargs', kwargs)
                ServiceOrder.objects.filter(**kwargs_filter).update(**kwargs)
                print('service')
                # service.save()
    except Exception as ex:
        print(ex)

# @receiver(post_save, sender=Component)
# @prevent_recursion
# def post_save_component(sender, instance=None, created=False, **kwargs):
#     """
#     Post Save Quotation
#     """
#     print('post save component')
#     try:
#         processes = Process.objects.filter(module='app_component.component')
#         # print('processes', processes)
#         for process in processes:
#             workflow, created = WorkFlow.objects.get_or_create(component=instance,
#                                                                process=process)
#             print('created', created)
#             if created:
#                 if process.code:
#                     workflow.code = process.code
#                     workflow.save()
#                     # print('save')
#
#             try:
#                 if instance.subsidiary:
#                     if instance.subsidiary.parent_subsidiary:
#                         # print('instance.subsidiary.parent_subsidiary', instance.subsidiary.parent_subsidiary.id)
#                         # print('process.subsidiaries_set.all()', process.subsidiaries.all())
#                         query = process.subsidiaries.filter(id=instance.subsidiary.parent_subsidiary.id)
#                         # print('query', query.query)
#                         if query.exists() is False:
#                             print('no se encuenta')
#                             workflow.is_active = False
#                             workflow.processed = True
#                             workflow.state = Type.objects.get(code='ENJ')
#                             workflow.save()
#
#             except Exception as ex:
#                 print(ex)
#
#     finally:
#         pass
