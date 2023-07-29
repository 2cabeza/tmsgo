import collections
import csv, codecs
from django.http import HttpResponse
from rest_framework.filters import OrderingFilter
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets, status, generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from app_catalog.views import NumberInFilter
from logics.utils import IsActiveFilterBackend, CodeRetrieveBackend
from .serializers import *
from .models import *
from rest_framework.response import Response
from django.db.models import Q, Sum, Avg, Value, IntegerField, CharField, TextField
from django.db.models.functions import Concat, Lower
CharField.register_lookup(Lower)


class ComponentFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        # print(request.user)
        print('component filter', request.GET)
        query = {}
        query_exclude = {}
        qr_code = request.GET.get('qr_code', None)
        code_1 = request.GET.get('code_1', None)
        search_text = request.GET.get('search_text', 1)
        search = request.GET.get('search', None)
        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)
        subsidiaries = request.GET.get('subsidiaries', None)
        new_contract = request.GET.get('new_contract', None)
        _filter = request.GET.get('filter', None)
        _exclude = request.GET.get('exclude', None)
        if search_text == 1:
            if search:
                print('search', search)
                print('request', request.GET)
                Component.objects.filter(qr_code__isnull=False)
                queryset = queryset.annotate(search_text=Concat(
                                                        'code_1',
                                                        Value(', '),
                                                        'code_2',
                                                        'id',
                                                        Value('.'),
                                                        'description',
                                                        Value('.'),
                                                        'observation',
                                                        Value('.'),
                                                        'subsidiary__name',
                                                        Value('.'),
                                                        'qr_code',
                                                        Value('.'),
                                                        'type__name',
                                                        Value('.'),
                                                        'location__name',
                                                        Value('.'),
                                                        'subsidiary__parent_subsidiary__name',
                                                        Value('.'),
                                                        output_field=CharField()
                                                ))
                queryset = queryset.filter(search_text__icontains=str(search))

        if start_date:
            query.update({'created__gte': date_format(start_date)})

        if end_date:
            query.update({'created__lte': date_format(end_date, 'max')})
        # print('query', query)start

        if subsidiaries:
            query.update({'subsidiary__parent_subsidiary__id__in': subsidiaries.split(',')})

        if qr_code:
            query.update({'qr_code': qr_code})

        if code_1:
            query.update({'code_1': code_1})

        if new_contract:
            query.update({'new_contract': new_contract})

        if _filter:

            query = json.loads(_filter)
            print('filter', query)

        if _exclude:

            query_exclude = json.loads(_exclude)
            print('exclude', query_exclude)

        queryset = queryset.filter(**query).exclude(**query_exclude)
        # print('query_filter final ', queryset.query)
        return queryset


class ComponentFilter(django_filters.FilterSet):
    id_in = NumberInFilter(field_name='id', lookup_expr='in')

    class Meta:
        model = Component
        fields = ['id_in', 'code_1', 'code_2', 'description', 'observation']


class Component2ViewSet(generics.ListAPIView):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer
    filter_backends = (filters.SearchFilter,
                       filters.OrderingFilter,
                       ComponentFilterBackend,
                       IsActiveFilterBackend,
                       django_filters.rest_framework.DjangoFilterBackend)
    search_fields = ('code_1', 'code_2', 'description', 'observation')
    filter_class = ComponentFilter


class ComponentViewSet(viewsets.ModelViewSet):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer
    filter_backends = [OrderingFilter, IsActiveFilterBackend, ComponentFilterBackend]

    def create(self, request):

        data = request.data.copy()
        files = data.get('files', None)
        print('data', data)
        try:
            values = data.copy()
            values.pop('workflow', None)
            values.pop('files', None)
            values.update({'creator_user': request.user.id})
            print('values', values)
            serializer = self.serializer_class(data=values)

            if serializer.is_valid():
                serializer.save()
                insertFiles(serializer.data.get('id'), files)

                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        except Exception as ex:
            print(ex)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):

        component = Component.objects.get(pk=pk)
        data = request.data.copy()
        files = data.get('files', None)
        print('data', data)

        try:
            values = data.copy()
            values.pop('files', None)
            values.update({'editor_user': request.user.id})
            # print('values', values)
            serializer = self.serializer_class(component, data=values)
            insertFiles(component.id, files)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as ex:
            print(ex)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def insertFiles(id, files):
    try:
        AttachedFiles.objects.filter(component_id=id).delete()
        if files:
            for file in files:
                AttachedFiles.objects.get_or_create(
                    component_id=id,
                    name=file.get('name'),
                    value=file.get('value')
                )

        print('insert files')
        print('component', id)
        print('files', files)
        return True
    except Exception as ex:
        print(ex)
        return False


class AttachedFilesViewSet(viewsets.ModelViewSet):
    queryset = AttachedFiles.objects.all()
    serializer_class = AttachedFilesSerializer
    filter_backends = [OrderingFilter, IsActiveFilterBackend]

    # def create(self, request, *args, **kwargs):
    #     print('request', request)
    #     return Response('hola')


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    filter_backends = [OrderingFilter, IsActiveFilterBackend]


class ComponentServiceOrderViewSet(viewsets.ModelViewSet):
    queryset = ComponentServiceOrder.objects.all()
    serializer_class = ComponentServiceOrderSerializer
    filter_backends = [OrderingFilter, RequestParamsFilterBackend]

    def create(self, request):

        data = request.data.copy()
        print('data', data)
        context_id = data.get('context_type', None)
        component = data.get('component', None)

        ids = []
        try:
            for comp in component:
                id_ = comp.get('id')
                ids.append(id_)
                print('component', context_id, id_)
                obj, created = ComponentServiceOrder.objects \
                    .get_or_create(component_id=id_,
                                   service_order_id=context_id
                                   )
                obj.key = 'component'
                obj.editor_user = request.user
                obj.save()

            # item delete not exist
            to_delete = ComponentServiceOrder.objects\
                .filter(service_order=context_id)\
                .exclude(component_id__in=ids).delete()

            obj_ = ComponentServiceOrder.objects.filter(service_order=context_id)
            serializer = self.serializer_class(obj_, many=True)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        except Exception as ex:
            print(ex)
            return Response(ex, status=status.HTTP_400_BAD_REQUEST)


class TypeFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        query = {}
        type_parent = request.GET.get('type_parent', None)
        try:
            if type_parent:
                type_parent = Type.objects.get(code=type_parent)
                query.update({'type_parent': type_parent})

        except Exception as ex:
            print(ex)
        return queryset.filter(**query)


class TypeViewSet(viewsets.ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    filter_backends = [OrderingFilter, IsActiveFilterBackend, TypeFilterBackend]


class ComponentLocationViewSet(viewsets.ModelViewSet):
    queryset = ComponentLocation.objects.all()
    serializer_class = ComponentLocationSerializer
    filter_backends = [OrderingFilter, IsActiveFilterBackend]


class WorkFlowViewSet(viewsets.ModelViewSet):
    queryset = WorkFlow.objects.all()
    serializer_class = WorkflowSerializer
    filter_backends = [OrderingFilter, IsActiveFilterBackend]

    def update(self, request, pk=None):

        workflow = WorkFlow.objects.get(pk=pk)
        data = request.data.copy()
        state = data.get('state', None)
        files = data.get('files', None)
        print('files', files)
        values = data.copy()
        values.pop('files', None)
        values.update({'editor_user': request.user.id})
        values.update({'component': workflow.component.id})
        values.update({'code': workflow.code})
        print('state', state)
        if state:
            values.update({'state': state.get('id')})
        print('VALUES', values)

        # return Response(data=values)

        try:
            serializer = self.serializer_class(workflow, data=values)
            insert_meta(workflow.id, files, 'UPLOAD')
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as ex:
            print(ex)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def insert_meta(_id, data, code):
    try:
        MetaWorkflow.objects.filter(workflow_id=_id).delete()
        if data:
            for item in data:
                MetaWorkflow.objects.get_or_create(
                    workflow_id=_id,
                    key=item.get('name'),
                    code=code,
                    value=item.get('value')
                )

        print('insert meta')
        print('workflow', _id)
        print('files', data)
        return True
    except Exception as ex:
        print(ex)
        return False


class DownloadFile(APIView):
    """
    post:
    Descarga de archivo excel. Ejemplo:
    - `/basicmall/api/download_file/`
    """
    permission_classes = [AllowAny]

    def get(self, request):

        start = request.data.get('start', None)
        end = request.data.get('end', None)
        excel_name = 'excel_inventario'
        header = []
        body = []

        print(request.data.get('filtro'))
        print(excel_name)
        print('component filter', request.GET)
        query = {}
        search = request.GET.get('search', None)
        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)
        subsidiaries = request.GET.get('subsidiaries', None)
        queryset = Component.objects.filter(is_removed=False).order_by('-created')
        if search:
            print('search', search)
            # print('request', request.GET)
            # Component.objects.filter(subsidiary__parent_subsidiary__name=)
            queryset = queryset.annotate(search_text=Concat(
                'code_1',
                Value(', '),
                'code_2',
                'id',
                Value('.'),
                'description',
                Value('.'),
                'observation',
                Value('.'),
                'subsidiary__name',
                Value('.'),
                'qr_code',
                Value('.'),
                'type__name',
                Value('.'),
                'location__name',
                Value('.'),
                'subsidiary__parent_subsidiary__name',
                Value('.'),
                output_field=CharField()
            ))

            queryset = queryset.filter(search_text__icontains=search)

        if start_date:
            query.update({'created__gte': date_format(start_date)})

        if end_date:
            query.update({'created__lte': date_format(end_date, 'max')})
        # print('query', query)

        if subsidiaries:
            query.update({'subsidiary__parent_subsidiary__id__in': subsidiaries.split(',')})

        queryset = queryset.filter(**query)

        header.append("ID")
        header.append("Sucursal")
        header.append("Estado MEL")
        header.append("Estado Venta")
        header.append("Publicado Venta")
        header.append("Creada")
        header.append("Modificada")
        header.append("Cantidad")
        header.append("Cantidad MEL")
        header.append("Descripción")
        header.append("Patio")
        header.append("Ubicación")
        header.append("Código SAP")
        header.append("NP")
        header.append("Código QR")
        header.append("Tipo")
        header.append("Peso")
        header.append("Largo")
        header.append("Ancho")
        header.append("Alto")
        try:
            for component in queryset:
                row_body = []
                subsidiary_path = ''
                state_mel = 'Pendiente'
                state_vta = 'Pendiente'
                processes_vta = 'No'
                created = component.created
                modified = component.modified
                quantity = component.quantity
                quantity_mel = '0'
                description = component.description
                subsidiary = ''
                location = ''
                type_ = ''
                code_1 = component.code_1
                code_2 = component.code_2
                code_qr = component.qr_code
                weight = component.weight
                length = component.long
                width = component.width
                height = component.height

                if component.subsidiary:
                    subsidiary = component.subsidiary.name
                    if component.subsidiary.parent_subsidiary:
                        subsidiary_path = component.subsidiary.parent_subsidiary.name

                if component.location:
                    location = component.location.name

                if component.type:
                    type_ = component.type.name

                workflow = WorkFlow.objects.filter(component=component)\
                    .order_by('process__order')

                for work in workflow:
                    if workflow.exists():
                        if work.process.code == 'VTA':
                            if work.state:
                                state_vta = work.state.name

                            if work.processed:
                                processes_vta = 'Sí'
                            else:
                                processes_vta = 'No'
                        elif work.process.code == 'MEL':
                            if work.state:
                                state_mel = work.state.name
                                quantity_mel = work.value_1

                row_body.append(component.id)
                row_body.append(subsidiary_path)
                row_body.append(state_mel)
                row_body.append(state_vta)
                row_body.append(processes_vta)
                row_body.append(created)
                row_body.append(modified)
                row_body.append(quantity)
                row_body.append(quantity_mel)
                row_body.append(description)
                row_body.append(subsidiary)
                row_body.append(location)
                row_body.append(code_1)
                row_body.append(code_2)
                row_body.append(code_qr)
                row_body.append(type_)
                row_body.append(weight)
                row_body.append(length)
                row_body.append(width)
                row_body.append(height)
                body.append(row_body)
        except Exception as e:
            print(e)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="export-inv-{}.csv"'.format(str(timezone.now().date()))
        response.write(codecs.BOM_UTF8)
        wr = csv.writer(response, delimiter=';')
        wr.writerow(header)
        wr.writerows(body)

        return response


class Report(APIView):

    def get(self, request):
        data = []
        company = request.GET.get('company', None)
        days = request.GET.get('days', None)
        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)

        days = int(days) if days else None
        # get difference days number
        _start_date = None
        _range = None
        if start_date:
            diff = date_format(start_date) - date_format(end_date)
            days = (diff.days * -1)
            _start_date = start_date + ' 00:00:00'
            _range = range(int(days) + 1)
        else:
            _range = reversed(range(int(days)))
        # data = statistics(company, days, start_date, end_date)
        if days:
            for item in _range:
                # print(item, _start_date)
                # with start date and end date
                if start_date:
                    num = 0
                    if item > 0:
                        num = 1

                    _start_date = add_days_date(_start_date, num)
                    # print('format', num, _start_date)
                # with number days
                else:
                    _start_date = get_date_by_day_number(item)

                # print(item, _start_date)
                _end_date = date_format(_start_date, 'max')
                _statistics = {
                    'alienated': 5,
                    'no_alienated': 2,
                    'scrap': 3
                }
                obj = {'day': _start_date, 'statistics': _statistics}
                data.append(obj)

        return Response(data)
