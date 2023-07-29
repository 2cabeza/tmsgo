from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.db import connection

from logics.settings import PROJECT_APPS
from logics.utils import get_model_fields


# def _get_fields():
#     """
#     get fields of the model
#     Returns:
#     tuple result
#
#     """
#     res = []
#     # processes = apps.get_model('app_general', 'Process').objects.all()\
#     #     .values('module')\
#     #     .order_by('module')\
#     #     .distinct()
#
#     with connection.cursor() as cursor:
#         cursor.execute("SELECT DISTINCT "
#                        "module "
#                        "FROM app_general_process "
#                        "WHERE "
#                        "is_removed=false")
#         row = cursor.fetchall()
#         processes = row
#     context_types = ContentType.objects\
#         .filter(app_label__in=PROJECT_APPS)\
#         .order_by('app_label')
#     print('processes', processes)
#     for process in processes:
#         app = process[0].split('.')[0]
#         app = apps.get_app_config(app)
#         # print('process', app.get_models())
#         print('GET MODELS', app.get_models())
#         for model in app.get_models():
#             print('model', model)
#             app_model_name = '{}.{}'.format(str(model._meta.app_label),
#                                             str(model._meta.model_name)
#                                             )
#             # print('model', str(model._meta.app_label), str(model._meta.model_name), app_model_name)
#             res += get_model_fields(app_model_name)
#             # resultl = get_model_fields(app_model_name)
#             # print('result', resultl)
#             # print('#################')
#         # continue
#     # for item in res:
#     #     print('item', item)
#     # print('res', res)
#     return res


