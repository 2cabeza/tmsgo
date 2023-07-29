from copy import deepcopy

from django.contrib.auth.models import Group

from app_component.tasks import create_product
from app_transport_services.models import ServiceOrder
from logics.utils import *
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel, SoftDeletableModel
from app_general.models import *
import magic

CREATE_TYPE = (
    ('subsidiary', _('subsidiary')),
    ('mel', _('mel')),
)


class Type(SoftDeletableModel):
    name = models.CharField(
        max_length=100,
        verbose_name=_('name'))
    code = models.CharField(
        max_length=80,
        unique=True,
        verbose_name=_('code'))
    description = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_('description'))
    type_parent = models.ForeignKey(
        'Type',
        blank=True,
        null=True,
        related_name='parent',
        on_delete=models.CASCADE,
        verbose_name=_('type parent'))
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('type')
        verbose_name_plural = _('types')

    def __str__(self):
        return "{} - ({})".format(self.name, self.code)


class Location(TimeStampedModel, SoftDeletableModel):
    name = models.CharField(
        max_length=100,
        default='',
        verbose_name=_('name'))
    code = models.CharField(
        max_length=80,
        default='',
        verbose_name=_('code'))
    description = models.CharField(
        max_length=255,
        blank=True,
        null=True,
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
    subsidiary = models.ForeignKey(
        Subsidiary,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('subsidiary'))
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('location')
        verbose_name_plural = _('locations')
        unique_together = ('name', 'code', 'subsidiary')

    def __str__(self):
        return "{} - ({})".format(self.name, self.code)


class Component(TimeStampedModel, SoftDeletableModel):

    subsidiary = models.ForeignKey(
        Subsidiary,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('subsidiary'))
    subsidiary2 = models.ForeignKey(
        Subsidiary,
        blank=True,
        null=True,
        related_name='subsidiary2',
        on_delete=models.CASCADE,
        verbose_name=_('subsidiary2'))
    create_type = models.CharField(
        max_length=100,
        default='subsidiary',
        choices=CREATE_TYPE,
        blank=True,
        verbose_name=_('create type'))
    code_1 = models.CharField(
        max_length=100,
        default='',
        blank=True,
        verbose_name=_('code 1'))
    code_2 = models.CharField(
        max_length=100,
        default='',
        blank=True,
        verbose_name=_('code 2'))
    qr_code = models.CharField(
        max_length=100,
        default='',
        blank=True,
        verbose_name=_('qr code'))
    ticket = models.CharField(
        max_length=100,
        default='',
        blank=True,
        null=True,
        verbose_name=_('ticket'))
    quantity = models.IntegerField(
        default=0,
        blank=True,
        verbose_name=_('quantity'))
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
    location = models.ForeignKey(
        Location,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('location'))
    type = models.ForeignKey(
        Type,
        blank=True,
        null=True,
        related_name='type',
        on_delete=models.CASCADE,
        verbose_name=_('type'))
    description = models.TextField(
        default='',
        blank=True,
        verbose_name=_('description'))
    observation = models.TextField(
        default='',
        blank=True,
        verbose_name=_('observation'))
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
    width = models.DecimalField(
        default=0.0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        help_text=_('mt'),
        verbose_name=_('width'))
    height = models.DecimalField(
        default=0.0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        help_text=_('mt'),
        verbose_name=_('height'))
    long = models.DecimalField(
        default=0.0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        help_text=_('mt'),
        verbose_name=_('long'))
    priority = models.BooleanField(
        default=False,
        blank=True,
        verbose_name=_('priority'))
    creator_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        related_name='creator_user',
        on_delete=models.CASCADE,
        verbose_name=_('creator user')
    )
    editor_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        related_name='editor_user',
        on_delete=models.CASCADE,
        verbose_name=_('editor user')
    )
    published_url = models.URLField(
        default='',
        blank=True,
        verbose_name=_('published url'))
    processed = models.BooleanField(
        default=False,
        verbose_name=_('processed'))
    published = models.BooleanField(
        default=False,
        verbose_name=_('published'))
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))
    new_contract = models.BooleanField(
        default=False,
        verbose_name=_('new contract'))

    class Meta:
        verbose_name = _('component')
        verbose_name_plural = _('components')

    def __str__(self):
        init = ''
        if self.id:
            init = '#' + str(self.id)
        return "{}".format(init)

    def get_status(self):
        status = None

        return status


class WorkFlow(TimeStampedModel, SoftDeletableModel):
    component = models.ForeignKey(
        Component,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('component')
    )
    state = models.ForeignKey(
        Type,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('state')
    )
    process = models.ForeignKey(
        Process,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('process')
    )
    code = models.CharField(
        max_length=100,
        default='',
        blank=True,
        null=True,
        verbose_name=_('code'))
    value_1 = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('value 1'))
    value_2 = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('value 2'))
    value_3 = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('value 3'))
    description = models.TextField(
        default='',
        blank=True,
        null=True,
        verbose_name=_('description'))
    observation = models.TextField(
        default='',
        blank=True,
        null=True,
        verbose_name=_('observation'))
    priority = models.BooleanField(
        default=False,
        verbose_name=_('priority'))
    upload = models.BooleanField(
        default=False,
        verbose_name=_('upload'))
    processed = models.BooleanField(
        default=False,
        verbose_name=_('processed'))
    editor_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('editor user')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('work flow')
        verbose_name_plural = _('workflows')
        unique_together = ('code', 'component',)

    def __str__(self):
        return "item ({})".format(self.code)


class MetaWorkflow(MetaModel):
    workflow = models.ForeignKey(
        WorkFlow,
        on_delete=models.CASCADE,
        verbose_name=_('workflow')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('meta')
        verbose_name_plural = _('meta')

    def __str__(self):
        return "{}".format(self.key)


class WorkFlowLog(TimeStampedModel, SoftDeletableModel):
    component = models.ForeignKey(
        Component,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('component')
    )
    state = models.ForeignKey(
        Type,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('state')
    )
    process = models.ForeignKey(
        Process,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('process')
    )
    code = models.CharField(
        max_length=100,
        default='',
        blank=True,
        null=True,
        verbose_name=_('code'))
    value_1 = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('value 1'))
    value_2 = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('value 2'))
    description = models.TextField(
        default='',
        blank=True,
        null=True,
        verbose_name=_('description'))
    observation = models.TextField(
        default='',
        blank=True,
        null=True,
        verbose_name=_('observation'))
    priority = models.BooleanField(
        default=False,
        verbose_name=_('priority'))
    processed = models.BooleanField(
        default=False,
        verbose_name=_('processed'))
    editor_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('editor user')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('workflows log')
        verbose_name_plural = _('workflow logs')

    def __str__(self):
        return "item ({})".format(self.code)


class AttachedFiles(SoftDeletableModel):
    name = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name=_('name'))
    value = models.URLField(
        blank=True,
        null=True,
        verbose_name=_('value'))
    code = models.CharField(
        max_length=100,
        default='image',
        blank=True,
        verbose_name=_('code'))
    component = models.ForeignKey(
        Component,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('component')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('attached file')
        verbose_name_plural = _('attached file')

    def __str__(self):
        return "{}".format(self.name)


class ComponentLocation(TimeStampedModel, SoftDeletableModel):
    component = models.ForeignKey(
        Component,
        on_delete=models.CASCADE,
        verbose_name=_('component')
    )
    location = models.ForeignKey(
        Location,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('location')
    )
    observation = models.TextField(
        default='',
        blank=True,
        null=True,
        verbose_name=_('observation'))
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active'))

    class Meta:
        verbose_name = _('components location')
        verbose_name_plural = _('component locations')

    def __str__(self):
        return "item ({})".format(self.component)


class ComponentServiceOrder(TimeStampedModel, SoftDeletableModel):
    component = models.ForeignKey(
        Component,
        on_delete=models.CASCADE,
        verbose_name=_('component')
    )
    service_order = models.ForeignKey(
        ServiceOrder,
        on_delete=models.CASCADE,
        verbose_name=_('service order')
    )
    key = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('key'))
    editor_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('editor user')
    )

    class Meta:
        verbose_name = _('components by service orders')
        verbose_name_plural = _('components by service orders')

    def __str__(self):
        return "item ({})".format(self.component)


@receiver(post_save, sender=Component)
@prevent_recursion
def post_save_component(sender, instance=None, created=False, **kwargs):
    """
    Post Save Quotation
    """
    print('post save component')
    try:
        processes = Process.objects.filter(module='app_component.component')
        # print('processes', processes)
        for process in processes:
            workflow, created = WorkFlow.objects.get_or_create(component=instance,
                                                               process=process)
            print('created', created)
            if created:
                if process.code:
                    workflow.code = process.code
                    workflow.save()
                    # print('save')

            try:
                if instance.subsidiary:
                    if instance.subsidiary.parent_subsidiary:
                        # print('instance.subsidiary.parent_subsidiary', instance.subsidiary.parent_subsidiary.id)
                        # print('process.subsidiaries_set.all()', process.subsidiaries.all())
                        query = process.subsidiaries.filter(id=instance.subsidiary.parent_subsidiary.id)
                        # print('query', query.query)
                        if query.exists() is False:
                            print('no se encuenta')
                            workflow.is_active = False
                            workflow.processed = True
                            workflow.state = Type.objects.get(code='ENJ')
                            workflow.save()

            except Exception as ex:
                print(ex)

    finally:
        pass


@receiver(post_save, sender=WorkFlow)
@prevent_recursion
def post_save_workflow(sender, instance=None, created=False, **kwargs):
    """
    Post Save WorkFlow
    """
    # processes = Process.objects.filter(module='app_component.component')
    # # print('processes', processes)
    # for process in processes:
    #     workflow, created = WorkFlow.objects.get_or_create(component=instance,
    #                                                        process=process)
    # print('created', created)
    # if created:
    #     if process.code:
    #         workflow.code = process.code
    #         workflow.save()
    #         # print('save')
    # else:
    # check is procceess per inject in woocommerce

    # print('post save workflow')
    # if instance.shipping_cost:
    #     if float(instance.shipping_cost) > 0.0:
    #         instance.with_shipping = True
    # print('POST DATA', instance)

    # create log copy
    try:
        # processes = Process.objects.filter(id=instance.process.id)
        fields = FieldName.objects.filter(process=instance.process, type='conditional')
        # print('processes fields', fields)
        for field in fields:
            # print('field.key', field.key)
            # print('instance data', instance.)
            kwargs = {}
            kwargs.update({'id': instance.id})
            kwargs.update(field.conditions)
            # print('kwargs ID', kwargs)
            wf = WorkFlow.objects.filter(**kwargs)
            # new_status = getattr(instance, 'state__code', False)
            # print(wf)
            data = {}
            data.update({field.key: False})
            state = False
            if wf.exists():
                state = True
                data.update({field.key: True})

            # print('estado final kwargs', data)
            # up = WorkFlow.objects.filter(**kwargs).update(**data)
            # print(up)
            if field.key == 'processed':
                instance.processed = state

    except Exception as ex:
        print(ex)

    try:
        last_workflow = deepcopy(instance)
        last_workflow.pk = None
        last_workflow.created = None
        last_workflow.modified = None
        workflow_log, created = WorkFlowLog.objects.create(last_workflow)
        if created:
            print('Creo copia!')
            print('worklog', workflow_log)
    except Exception as ex:
        print('ex', ex)
        pass

    # process per inject to woocommerce
    try:
        if instance.code == 'VTA':
            if instance.processed:
                print('instance.component.published', instance.component.published)
                if instance.component.published is False:
                    print('published?')
                    print('save', instance.processed, instance.code)
                    print('esta procesada', instance.code)
                    images = AttachedFiles.objects.filter(component=instance.component)
                    img = []
                    for image in images:
                        for _type in ['.png', '.jpg', '.jpeg']:
                            if str(image.value).lower().__contains__(_type):
                                obj_img = {'src': image.value}
                                img.append(obj_img)
                    obj = {
                        'name': instance.component.description,
                        'type': 'external',
                        'sku': '{}{}-{}'.format(instance.code, instance.component.id, instance.component.qr_code),
                        'price': str(instance.value_2),
                        'description': instance.component.observation,
                        'short_description': instance.component.description,
                        'weight': str(instance.component.weight),
                        "dimensions": {"length": str(instance.component.weight),
                                       "width": str(instance.component.width),
                                       "height": str(instance.component.height)},
                        'categories': [
                            {
                                "id": 52
                            }
                        ],
                        'images': img
                    }
                    response = create_product(obj)
                    Component.objects.filter(pk=instance.component.id).update(published=True)
                    print('response models', response)
                else:
                    print('ya esta publicada')
            else:
                print('Aun falta procesar.', instance.code)
    except Exception as ex:
        print(ex)
