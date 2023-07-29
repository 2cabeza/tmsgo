from django.db import models
from model_utils.models import TimeStampedModel, SoftDeletableModel
from django.utils.translation import ugettext_lazy as _
from app_general.models import Organization
from django.conf import settings
from django.contrib.auth.models import Group, Permission


class Application(TimeStampedModel):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        verbose_name=_('organization'))
    name = models.CharField(
        max_length=250,
        verbose_name=_('name'))
    file = models.FileField(
        upload_to=settings.RELATIVE_IMAGE_PATH,
        null=True,
        blank=True,
        verbose_name=_('file')
    )
    code = models.CharField(
        max_length=250,
        blank=True,
        verbose_name=_('code'))
    domain = models.URLField(
        blank=True)
    repository = models.CharField(
        max_length=250,
        blank=True,
        verbose_name=_('repository'))
    description = models.TextField(
        max_length=250,
        blank=True,
        verbose_name=_('description')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('is active')
    )

    class Meta:
        verbose_name = _('application')
        verbose_name_plural = _('applications')

    def __str__(self):
        return "{}".format(self.name)


class ActionType(models.Model):
    code = models.CharField(
        verbose_name=_('code'),
        max_length=256)
    description = models.TextField(
        max_length=250,
        blank=True,
        verbose_name=_('description')
    )

    class Meta:
        verbose_name_plural = _('type of actions')

    def __str__(self):
        return "{}".format(self.code)


class List(TimeStampedModel, SoftDeletableModel):
    application = models.ForeignKey(
        Application,
        verbose_name=_('application'),
        on_delete=models.CASCADE)
    parent_list = models.ForeignKey(
        'List',
        null=True,
        blank=True,
        verbose_name=_('parent list'),
        on_delete=models.CASCADE)
    title = models.CharField(
        verbose_name=_('title'),
        default='',
        max_length=256)
    code = models.CharField(
        verbose_name=_('code'),
        blank=True,
        default='',
        max_length=256)
    action_type = models.ForeignKey(
        ActionType,
        verbose_name=_('action type'),
        blank=True,
        default='',
        on_delete=models.CASCADE)
    action_value = models.CharField(
        verbose_name=_('action value'),
        blank=True,
        default='',
        max_length=256)
    custom_style = models.CharField(
        verbose_name=_('custom style'),
        blank=True,
        default='',
        max_length=100)
    file = models.FileField(
        max_length=1000,
        upload_to=settings.RELATIVE_IMAGE_PATH,
        default='',
        blank=True,
        verbose_name=_('file')
    )
    order = models.PositiveIntegerField(
        default=1,
        verbose_name=_('order')
    )

    def __str__(self):
        title = ''
        if self.parent_list:
            title = "{} - {}".format(self.parent_list.title, self.title)
        else:
            title = self.title
        return "{} - {}".format(self.application.name, title)

    class Meta:
        verbose_name_plural = _('lists')


class ListGroupPermission(models.Model):

    group = models.ForeignKey(
        Group,
        verbose_name=_('group'),
        on_delete=models.CASCADE)
    lists = models.ManyToManyField(
        List,
        verbose_name=_('lists')
    )

    def __str__(self):
        return "{}".format(self.group)

    class Meta:
        verbose_name_plural = _('list group permissions')
