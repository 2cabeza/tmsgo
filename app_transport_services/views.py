from django.db.models import Q, Sum, Avg, Value, IntegerField, CharField, TextField
from django.db.models.functions import Concat
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework import viewsets, status

from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework.filters import BaseFilterBackend, OrderingFilter
from django.utils import dateparse
import datetime


class ServiceOrderFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        print(request.user)
        print('-- service order filter')
        query = {}
        search = request.GET.get('search', None)
        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)
        equipments = request.GET.get('_equipments', None)
        drivers = request.GET.get('_drivers', None)
        contract = request.GET.get('_contract', None)
        service_id = request.GET.get('_service_id', None)
        is_driver = True if request.GET.get('_is_driver', "0") == "1" else False

        # if not is_driver:
        #
        #     if service_id and service_id != "":
        #         query.update({'id': int(service_id)})
        #
        #     elif equipments and equipments != "":
        #         query.update({'equipmentserviceorder__equipment__id': equipments})
        #
        #     elif drivers and drivers != "":
        #         query.update({'driverserviceorder__driver__id': drivers})
        #
        #     elif service_id and service_id != "":
        #         query.update({'id': int(service_id)})
        #
        #     elif contract and contract != "":
        #         query.update({'contract__id': contract})
        #
        #     elif start_date and end_date:
        #         # queryset = queryset.filter(service_date__range=(start_date, end_date))
        #         query.update(
        #             {'service_date__range':
        #                 (
        #                     dateparse.parse_datetime(start_date),
        #                     dateparse.parse_datetime(end_date)
        #                 )}
        #         )
        #
        # elif is_driver:
        #     query.update({'driverserviceorder__driver__user_profile__user': request.user})
        #     # queryset = ServiceOrder.objects.filter(driverserviceorder__driver__user_profile__user=)
        if search:
            print('search', search)
            columns = ['id', 'reference']
            # queryset = ServiceOrder.objects.values(*columns)
            # queryset = queryset.annotate(id_service=Value('id', CharField()))
            # queryset = queryset.annotate(reference_=Value('reference', CharField()))
            # queryset = queryset.annotate(search_text=Concat('id_service',
            #                                                 Value('id_service', 'reference_'),
            #                                                 'reference_',
            #                                                 Value(''),
            #                                                 # 'type__code',
            #                                                 )
            #                             )

            queryset = queryset.annotate(search_text=Concat(
                                                    'reference',
                                                    Value(', '),
                                                    'type__code',
                                                    'id',
                                                    Value('.'),
                                                    'type__name',
                                                    Value('.'),

                                                    output_field=CharField()
                                            ))
            # for cc in queryset:
            #     print('=>', cc.search_text)
            # print('queryset 0', queryset)
            queryset = queryset.filter(search_text__icontains=search)
            # print('queryset 1', queryset)
            # print('queryset 1', len(queryset))
            # query = {}
            # # query.update('id__in', query_filter)
            # print('queryset 2', queryset)
            # for cc in queryset:
            #     print('detail 2', cc)
            if start_date and end_date:
                # queryset = queryset.filter(service_date__range=(start_date, end_date))
                query.update(
                    {'service_date__range':
                        (
                            dateparse.parse_datetime(start_date),
                            dateparse.parse_datetime(end_date)
                        )}
                )
        queryset = queryset.filter(**query)
        # print('query_filter final', queryset.query)
        return queryset


class ServiceOrderViewSet(viewsets.ModelViewSet):
    queryset = ServiceOrder.objects.all()
    serializer_class = ServiceOrderSerializer
    filter_backends = [OrderingFilter, ServiceOrderFilterBackend]

    # def list(self, request, *args, **kwargs):
    #     res = super(ServiceOrderViewSet, self).list(request, *args, **kwargs)
    #     res.data = res.data
    #     return res

    def retrieve(self, request, *args, **kwargs):
        res = super(ServiceOrderViewSet, self).retrieve(request, *args, **kwargs)
        res.data = res.data
        return res

    def create(self, request, *args, **kwargs):
        
        service_id = request.data.get('_service_id', None)
        equipments = request.data.get('_equipments', None)
        drivers = request.data.get('_drivers', None)
        contract = request.data.get('_contract', None)
        cost_center = request.data.get('_cost_center', None)
        service_date = request.data.get('_service_date', None)
        address = request.data.get('_address', '')
        reference = request.data.get('_reference', '')
        office_guide = request.data.get('_office_guide', None)
        amount = request.data.get('_amount', 0)
        estimated_closing_date = request.data.get('_estimated_closing_date', None)
        priority = True if (request.data.get('_priority', 0) == 1) else False
        origin = request.data.get('_origins', None)
        destination = request.data.get('_destinations', None)
        weight = request.data.get('_amount', None)
        volume = request.data.get('_volume', None)
        type = request.data.get('_type', None)
        provider = request.data.get('provider', None)

        data = {'data': {}, 'status': True, 'message': 'OK'}
        print('service_date', service_date)
        try:
            if contract:
                contract = Contract.objects.get(id=contract)

            if cost_center:
                cost_center = CostCenter.objects.get(id=cost_center)

            if origin:
                origin = Subsidiary.objects.get(id=origin)

            if destination:
                destination = Subsidiary.objects.get(id=destination)

            if type:
                type = ServiceOrderType.objects.get(code=type)

            if provider:
                provider = Provider.objects.get(id=provider)

            service_order, created = ServiceOrder.objects.get_or_create(id=service_id)
            service_order.contract = contract
            service_order.cost_center = cost_center
            if service_date:
                service_order.service_date = dateparse.parse_datetime(service_date)
            service_order.address = address
            service_order.office_guide = office_guide
            service_order.amount = amount
            if estimated_closing_date:
                service_order.estimated_closing_date = dateparse.parse_datetime(estimated_closing_date)
            service_order.priority = priority
            service_order.reference = reference
            service_order.origin = origin
            service_order.destination = destination
            service_order.weight = weight
            service_order.volume = volume
            service_order.type = type
            service_order.provider = provider
            service_order.user_created = request.user
            service_order.save()
            print('created', created)
            if service_order:
                if equipments:
                    equipments = Equipment.objects.filter(id__in=equipments.split(","))
                    # clear equipments x service
                    if service_id:
                        EquipmentServiceOrder.objects.filter(
                            service_order=service_order
                        ).delete()
                    # insert equipment
                    for index, item in enumerate(equipments):
                        type_place = index + 1
                        EquipmentServiceOrder.objects.create(
                            service_order=service_order,
                            equipment=item,
                            type=type_place
                        )
                if drivers:
                    drivers = Driver.objects.filter(id__in=drivers.split(","))
                    # clear drivers x service
                    if service_id:
                        DriverServiceOrder.objects.filter(
                            service_order=service_order
                        ).delete()
                    # insert drivers
                    for index, item in enumerate(drivers):
                        type_place = index + 1
                        DriverServiceOrder.objects.create(
                            service_order=service_order,
                            driver=item,
                            type=type_place
                        )
                serializer = self.serializer_class(service_order, many=False)
                data.update({'data': serializer.data})

        except Exception as ex:
            data.update({'status': False})
            data.update({'message': str(ex)})
            print('create or update order service', ex)

        return Response(
            data=data,
            status=status.HTTP_201_CREATED
        )


class ServiceOrderTypeViewSet(viewsets.ModelViewSet):
    queryset = ServiceOrderType.objects.all()
    serializer_class = ServiceOrderTypeSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all().order_by('patent')
    serializer_class = EquipmentSerializer


class CostCenterViewSet(viewsets.ModelViewSet):
    queryset = CostCenter.objects.all().order_by('name')
    serializer_class = CostCenterSerializer


class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all().order_by('user_profile__user__last_name')
    serializer_class = DriverSerializer


class TrackingViewSet(viewsets.ModelViewSet):
    queryset = Tracking.objects.all()
    serializer_class = TrackingSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        service_order = request.data.get('service_order', None)
        latitude = request.data.get('latitude', None)
        longitude = request.data.get('longitude', None)

        try:
            if latitude is None or longitude is None:
                raise ValueError('Latitude or longitude missing.')
            if service_order:
                tracking, created = self.queryset.get_or_create(service_order_id=service_order)
                if tracking:
                    tracking.latitude = latitude
                    tracking.longitude = longitude
                    tracking.user = request.user
                    tracking.save()
                    serializer = self.serializer_class(tracking, many=False)
                    return Response(
                        data=serializer.data,
                        status=status.HTTP_201_CREATED
                    )

        except Exception as ex:
            print(ex)

        return Response(
            data=alert('The service does not exist or some of the required parameters cannot be found.'),
            status=status.HTTP_400_BAD_REQUEST
        )


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all().order_by('code')
    serializer_class = ContractSerializer


class CostTypeViewSet(viewsets.ModelViewSet):
    queryset = CostType.objects.all()
    serializer_class = CostTypeSerializer


class ServiceCostViewSet(viewsets.ModelViewSet):
    queryset = ServiceCost.objects.all()
    serializer_class = ServiceCostSerializer


class WorkLogTypeViewSet(viewsets.ModelViewSet):
    queryset = WorkLogType.objects.all()
    serializer_class = WorkLogTypeSerializer


class WorkLogViewSet(viewsets.ModelViewSet):
    queryset = WorkLog.objects.all().order_by('created')
    serializer_class = WorkLogSerializer

    def create(self, request, *args, **kwargs):

        service_order = request.data.get('service_order', None)
        type = request.data.get('type', 2)
        value = request.data.get('value', None)
        description = request.data.get('description', '')
        data = {'data': {}, 'status': True, 'message': 'OK'}

        try:
            if service_order:
                service_order = ServiceOrder.objects.get(id=service_order)
                if type:
                    type = WorkLogType.objects.get(id=type)

                work_log = WorkLog.objects.create(
                    service_order=service_order,
                    type=type,
                    value=value,
                    description=description,
                )
                serializer = WorkLogSerializer(work_log, many=False)
                data.update({'data': serializer.data})
        except Exception as ex:
            data.update({'status': False})
            data.update({'message': str(ex)})
            print(ex)

        return Response(
            data=data,
            status=status.HTTP_201_CREATED
        )


class Availability(APIView):
    """
    Availability and occupation
    """

    def get(self, request):
        # _get_fields()
        # get_model_fields('app_component.workflow')
        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)
        data = []
        # Equipments
        equipments = Equipment.objects.all().order_by('id')

        for equipment in equipments:
            services = ServiceOrder.objects\
                .extra(where=[
                            " ( "
                            "'" + start_date + "' "
                            " between app_transport_services_serviceorder.service_date and"
                            " app_transport_services_serviceorder.estimated_closing_date"
                            " OR "
                            " app_transport_services_serviceorder.service_date "
                            " between '" + start_date + "' and"
                            " '" + end_date + "'"
                            " ) "
                            ])\
                .filter(
                    Q(equipmentserviceorder__equipment=equipment) &
                    Q(is_active=True)
                )\
                .order_by('service_date').distinct()
            # print(services.query)

            tasks = []
            start = ''
            end = ''
            estimated_closing_date = ''

            for index, service in enumerate(services):

                service_date = service.service_date.strftime('%Y/%m/%d %H:%M')

                if service.estimated_closing_date:
                    estimated_closing_date = service.estimated_closing_date
                    end = service.estimated_closing_date.strftime('%Y/%m/%d %H:%M')

                tasks.append(
                    {
                        'id': '{}'.format(service.id),
                        'start_date': service.service_date,
                        'end_date': service.estimated_closing_date,
                        'Duration': 1,
                        'Progress': 100
                    }
                )
                # get min start_date
                if start == '':
                    start = service_date
                # get max closing_date

                if datetime.datetime.strptime(str(estimated_closing_date)[:19], '%Y-%m-%d %H:%M:%S') \
                        < datetime.datetime.strptime(str(service.estimated_closing_date)[:19], '%Y-%m-%d %H:%M:%S'):
                    end = service.estimated_closing_date.strftime('%Y/%m/%d %H:%M')
            # end for
            obj = {
                'key': equipment.id,
                'value': equipment.patent,
                'tasks': tasks
            }
            data.append(obj)

        return Response(data=data)


class WorkLogViewSet(viewsets.ModelViewSet):
    queryset = WorkLog.objects.all().order_by('created')
    serializer_class = WorkLogSerializer

    def create(self, request, *args, **kwargs):

        service_order = request.data.get('service_order', None)
        type = request.data.get('type', 2)
        value = request.data.get('value', None)
        description = request.data.get('description', '')
        data = {'data': {}, 'status': True, 'message': 'OK'}

        try:
            if service_order:
                service_order = ServiceOrder.objects.get(id=service_order)
                if type:
                    type = WorkLogType.objects.get(id=type)

                work_log = WorkLog.objects.create(
                    service_order=service_order,
                    type=type,
                    value=value,
                    description=description,
                )
                serializer = WorkLogSerializer(work_log, many=False)
                data.update({'data': serializer.data})
        except Exception as ex:
            data.update({'status': False})
            data.update({'message': str(ex)})
            print(ex)

        return Response(
            data=data,
            status=status.HTTP_201_CREATED
        )


class Statistics(APIView):
    """
    Statistics
    """


    def get(self, request):
        data = {}
        kwargs = {}

        # service type
        per_service_type = ServiceCost.objects \
            .filter(**kwargs, service_order__type__isnull=False).values('service_order__type') \
            .annotate(sum=Sum('value1')) \
            .values('service_order__type__name', 'sum') \
            .order_by('-sum')
        per_service_type_result = []
        for item in per_service_type:
            array_format = [item.get('service_order__type__name'), item.get('sum')]
            per_service_type_result.append(array_format)

        # cost type
        per_cost_type = ServiceCost.objects \
            .filter(**kwargs).values('cost_type') \
            .annotate(sum=Sum('value1')) \
            .values('cost_type__name', 'sum') \
            .order_by('cost_type__name')
        per_cost_type_result = []
        for item in per_cost_type:
            array_format = [item.get('cost_type__name'), item.get('sum')]
            per_cost_type_result.append(array_format)

        # type equipment
        per_equipment_type = ServiceCost.objects \
            .filter(**kwargs, equipment__isnull=False).values('equipment__type') \
            .annotate(sum=Sum('value1')) \
            .values('equipment__type__name', 'sum') \
            .order_by('-sum')
        per_equipment_type_result = []
        for item in per_equipment_type:
            array_format = [item.get('equipment__type__name'), item.get('sum')]
            per_equipment_type_result.append(array_format)

        cost_per_equipment_result = []
        cost_per_equipment = ServiceCost.objects \
            .filter(**kwargs, equipment__isnull=False).values('equipment') \
            .annotate(sum=Sum('value1')) \
            .values('equipment__patent', 'sum') \
            .order_by('-sum', 'equipment')
        for item in cost_per_equipment:
            array_format = [item.get('equipment__patent'), item.get('sum')]
            cost_per_equipment_result.append(array_format)
        print('per_equipment_type_result', cost_per_equipment_result)

        # equipment cost
        avg_equipment_cost = ServiceCost.objects \
            .filter(**kwargs).values('equipment') \
            .annotate(sum=Sum('value1')) \
            .values('sum') \
            .order_by('equipment') \
            .aggregate(avg=Avg('sum'))

        data = {
            'per_cost_type': per_cost_type_result,
            'per_service_type': per_service_type_result,
            'per_equipment_type': per_equipment_type_result,
            'cost_per_equipment': cost_per_equipment_result,
            'avg_equipment_cost': avg_equipment_cost.get('avg')
        }

        return Response(data=data)
