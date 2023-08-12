import json
import os
import sys
from enum import Enum
import requests
import six
from PIL import Image
from django.apps import apps
import xml.etree.cElementTree as et
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db.models import ManyToOneRel, ManyToManyRel, ManyToManyField
from django.db.models.signals import post_save
from rest_framework.filters import BaseFilterBackend, OrderingFilter
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from oauth2client.service_account import ServiceAccountCredentials
from django.utils.translation import ugettext_lazy as _
from datetime import datetime, timedelta, time
from django.utils import timezone
# Import
from google.cloud import storage
from functools import wraps
from django.forms import ImageField as DjangoImageField
from six import BytesIO

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets

from logics.settings import CREDENTIALS_PATH, GOOGLE_APPLICATION_CREDENTIALS, PROJECT_APPS, CACHE_DEFAULT_EXPIRY_SHORT, \
    CACHE_DEFAULT_EXPIRY_LONG


class Status(Enum):
    """
    Service Status
    """
    PENDING = dict(name=_('pending'), description='pendiente', color='#f1d700')
    OVERDUE = dict(name=_('overdue'), description='atrasado', color='#ff9f18')
    IN_PROCESS = dict(name=_('in process'), description='en proceso', color='#61bd50')
    FINISHED = dict(name=_('finished'), description='finalizada', color='#345262')
    CANCELLED = dict(name=_('cancelled'), description='cancelada', color='#ea5a47')


def upload_file(file_path, filename=None, folder=None, instance=None):

    credential_path = CREDENTIALS_PATH + GOOGLE_APPLICATION_CREDENTIALS['google']
    client = storage.Client.from_service_account_json(credential_path)
    bucket = client.get_bucket('tms-go')
    if not filename:
        f = open(file_path)
        filename = os.path.basename(f.name)

    if folder:
        filename = folder + '/' + filename
    print('file', filename)
    blob = bucket.blob(filename)
    blob.upload_from_filename(filename=file_path)

    return blob.public_url, filename


def upload_file_sign(sender, instance, **kwargs):
    folder = str(instance.__class__.__name__).lower()

    if instance.image:
        print('instance image sign', str(instance.image))
        # delete file temp
        if os.path.exists(str(instance.image)):
            url, filename = upload_file(
                file_path=str(instance.image),
                folder=folder)
            print(url)
            os.remove(str(instance.image))
            instance.image = filename
            instance.save()


def _get_access_token(credential_id, scopes=None):
    """Retrieve a valid access token that can be used to authorize requests.
    :return: Access token.
    """
    credentials_file = CREDENTIALS_PATH + GOOGLE_APPLICATION_CREDENTIALS[credential_id]
    print(credentials_file)
    with open(credentials_file) as json_file:
        data = json.load(json_file)
    scopes = ['https://www.googleapis.com/auth/firebase.messaging'] if not scopes else scopes
    print(scopes)
    credentials = ServiceAccountCredentials.from_json_keyfile_dict(data, scopes)
    access_token_info = credentials.get_access_token()
    return access_token_info.access_token


def _send_notification_push(credential_id, scopes=None, message=None):
    """send message per api of google notifications.
    :return: status send.
    """
    try:
        message = {
          "message": {
            "token": message.get('token'),
            "topic": "notificaciones",
            "notification": {
              "title": message.get('title') if message.get('title') else '',
              "body": message.get('body') if message.get('body') else ''
            },
            "webpush": {
              "headers": {
                "Urgency": "high"
              },
              "notification": {
                "body": message.get('body') if message.get('body') else '',
                "requireInteraction": "true",
                "icon": message.get('icon') if message.get('icon') else ''
              }
            }
          }
        }
        url = 'https://fcm.googleapis.com/v1/projects/rinno-dashboard/messages:send'
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {}'.format(_get_access_token(credential_id, scopes)),
        }
        response = requests.post(url, headers=headers, json=message)
        response = response.json()
    except Exception as ex:
        response = str(ex)

    return response


class IsActiveFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        query = {}
        is_active = True if int(request.GET.get('is_active', 1)) == 1 else False
        query.update({'is_active': is_active})
        return queryset.filter(**query)


class CodeRetrieveBackend(RetrieveModelMixin):

    def retrieve(self, request, pk=None):
        obj = get_object_or_404(self.queryset, code=pk)
        print('pk retrieve', pk)
        serializer = self.serializer_class(obj, context={'request': request, 'pk': pk})
        return Response(serializer.data)


class CodeRetrieveCacheBackend(RetrieveModelMixin):

    @method_decorator(cache_page(CACHE_DEFAULT_EXPIRY_SHORT))
    def retrieve(self, request, pk=None):
        obj = get_object_or_404(self.queryset, code=pk)
        serializer = self.serializer_class(obj, context={'request': request})
        return Response(serializer.data)


class BetweenDateBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        query = {}
        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)

        if start_date:
            query.update({'created__gte': date_format(start_date)})

        if end_date:
            query.update({'created__lte': date_format(end_date, 'max')})

        return queryset.filter(**query)


class CacheModelShortViewSet(viewsets.ModelViewSet):

    @method_decorator(cache_page(CACHE_DEFAULT_EXPIRY_SHORT))
    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)


class CacheModelLongViewSet(viewsets.ModelViewSet):

    @method_decorator(cache_page(CACHE_DEFAULT_EXPIRY_LONG))
    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)


class RequestParamsFilterBackend(BaseFilterBackend):
    """
    Create all get parameters to Dict and put to filter of queryset
    """
    def filter_queryset(self, request, queryset, view):
        query = request.GET.copy().dict()
        _pop(query, 'filter')
        _pop(query, 'exclude')
        _pop(query, 'ordering')
        return queryset.filter(**query)


def _pop(_dict={}, param=''):
    if _dict.get(param, None):
        _dict.pop(param)


def date_format(date_str, hour=None):
    """
    Format date
    :param hour:
    :param date_str:
    :return:
    """
    try:
        date_str = str(date_str).split(' ')[0]
        date_str = datetime.strptime(str(date_str), "%Y-%m-%d")

        if hour is not None:
            if hour == 'max':
                time_type = time.max
            if hour == 'min':
                time_type = time.min
            date_str = datetime.combine(date_str, time_type)
        date_str = timezone.get_current_timezone().localize(date_str)
        return date_str
    except Exception as ex:
        print(ex)
    return None


# def _date_format(date=None, format=None):
#     """
#     Format date
#     :param format:
#     :param date:
#     :return:
#     """
#     try:
#
#         date_str = datetime.strptime(date.date(), "%Y-%m-%d %h:%i")
#
#         date_str = datetime.combine(date_str, date.time)
#         date_str = timezone.get_current_timezone().localize(date_str)
#         return date_str
#     except Exception as ex:
#         print(ex)
#     return None


def get_apps():
    """
    get app of context type
    Returns:
    tuple result
    """
    res = []
    context_types = ContentType.objects.filter(app_label__in=PROJECT_APPS).order_by('app_label')
    for model in context_types:
        index = '{}.{}'.format(model.app_label, model.model)
        value = '{}.{}'.format(model.app_label, _(model.model))
        tuple_ = (index, value)
        res.append(tuple_)
    return res


def get_model_fields(model_name):
    """

    Args:
        model_name: string with format 'app_name.model_name'

    get fields of the model
    Returns:
    tuple result

    """
    # print('entrada', model_name)
    res = []
    app_split = model_name.split('.')
    if len(app_split) > 1:
        app = apps.get_app_config(app_split[0])
        _model = app.get_model(app_split[1])
        fields = _model._meta.get_fields()
        for field in fields:
            # print('field', field, type(field))
            if type(field) is not ManyToOneRel \
                    and type(field) is not ManyToManyRel \
                    and type(field) is not ManyToManyField:
                index_field = str(field)
                tuple_ = (index_field, index_field)
                # print('salida', tuple_)
                res.append(tuple_)
    else:
        return _('No valid format.') + ' (app_name.model_name)'
    # print('tuple', res)
    return res


def prevent_recursion(func):
    """
    Prevent Recursion in PostData
    :param func:
    :return:
    """
    @wraps(func)
    def no_recursion(sender, instance=None, **kwargs):

        if not instance:
            return

        if hasattr(instance, '_dirty'):
            return

        func(sender, instance=instance, **kwargs)

        try:
            instance._dirty: bool = True
            instance.save()
        finally:
            del instance._dirty

    return no_recursion


class SVGAndImageFormField(DjangoImageField):

    def to_python(self, data):
        """
        Checks that the file-upload field data contains a valid image (GIF, JPG,
        PNG, possibly others -- whatever the Python Imaging Library supports).
        """
        test_file = super(DjangoImageField, self).to_python(data)
        if test_file is None:
            return None

        # We need to get a file object for Pillow. We might have a path or we might
        # have to read the data into memory.
        if hasattr(data, 'temporary_file_path'):
            ifile = data.temporary_file_path()
        else:
            if hasattr(data, 'read'):
                ifile = BytesIO(data.read())
            else:
                ifile = BytesIO(data['content'])

        try:
            # load() could spot a truncated JPEG, but it loads the entire
            # image in memory, which is a DoS vector. See #3848 and #18520.
            image = Image.open(ifile)
            # verify() must be called immediately after the constructor.
            image.verify()

            # Annotating so subclasses can reuse it for their own validation
            test_file.image = image
            test_file.content_type = Image.MIME[image.format]
        except Exception:
            # add a workaround to handle svg images
            if not self.is_svg(ifile):
                six.reraise(ValidationError, ValidationError(
                    self.error_messages['invalid_image'],
                    code='invalid_image',
                ), sys.exc_info()[2])
        if hasattr(test_file, 'seek') and callable(test_file.seek):
            test_file.seek(0)
        return test_file

    def is_svg(self, f):
        """
        Check if provided file is svg
        """
        f.seek(0)
        tag = None
        try:
            for event, el in et.iterparse(f, ('start',)):
                tag = el.tag
                break
        except et.ParseError:
            pass
        return tag == '{http://www.w3.org/2000/svg}svg'


def get_date_by_day_number(days=None):
    """
    get date format for number day
    :param days:
    :return:
    """
    if days is not None:
        start_date = datetime.now(tz=timezone.utc) - timedelta(days=int(days))
        return date_format(start_date.date())
    else:
        return None


def add_days_date(start_date=None, days=None):
    """
    get date format for number day
    :param start_date:
    :param days:
    :return:
    """
    # tart_date = datetime.now(tz=timezone.utc) - timedelta(days=int(days))
    # start_date = datetime.strptime(str(start_date.date()), "%Y-%m-%d")
    # start_date = timezone.get_current_timezone().localize(start_date)
    # print('start', start_date, days)
    if days is not None:
        start_date = datetime.strptime(str(start_date), '%Y-%m-%d %H:%M:%S') + timedelta(days=days)
        return start_date
    else:
        start_date


def alert(message, status=None):
    """
    Custom object message
    :param message: Ex: 'Not Found'
    :param status: Ex: 'NOK'
    :return: Object
    """
    try:
        message = str(message)
    except Exception as ex:
        print(ex)
    message = dict(__status=(status if status is not None else 'NOK'), __message=message)
    return message
