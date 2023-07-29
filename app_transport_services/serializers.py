from rest_framework import serializers
from .models import *
from app_general.serializers import *


class WorkLogTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkLogType
        fields = ['id', 'name', 'code']


class WorkLogSerializer(serializers.ModelSerializer):
    type = WorkLogTypeSerializer()

    class Meta:
        model = WorkLog
        fields = '__all__'


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['id', 'code']


class ServiceOrderTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceOrderType
        fields = ['id', 'name', 'code', 'color']


class CostCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostCenter
        fields = ['id', 'name', 'address', 'contact']


class EquipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentType
        fields = ['id', 'name']


class EquipmentSerializer(serializers.ModelSerializer):
    # requires_context = True
    type = EquipmentTypeSerializer()
    contracts = ContractSerializer(many=True)
    last_service = serializers.SerializerMethodField()

    def get_last_service(self, obj):
        data = {}
        service_order = None
        try:
            if str(self.context.get('request')).isnumeric():
                print('dd')
                service_order = ServiceOrder.objects\
                    .get(id=self.context.get('request'))
            else:
                service_order = ServiceOrder.objects \
                    .filter(equipmentserviceorder__equipment=obj) \
                    .order_by('-service_date').first()
        except Exception as ex:
            print('context send error.')
            print(ex)

        if service_order:
            serializer = ServiceOrderMinSerializer(service_order, many=False)
            data = serializer.data
        return data

    class Meta:
        model = Equipment
        fields = '__all__'


class EquipmentServiceOrderSerializer(serializers.ModelSerializer):
    equipment = EquipmentSerializer()
    type = serializers.SerializerMethodField()

    def get_type(self, obj):
        return dict(PLACES).get(str(obj.type))

    class Meta:
        model = EquipmentServiceOrder
        fields = ['equipment', 'type']


class DriverSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer()
    contracts = ContractSerializer(many=True)

    class Meta:
        model = Driver
        fields = '__all__'


class DriverServiceOrderSerializer(serializers.ModelSerializer):
    driver = DriverSerializer()
    type = serializers.SerializerMethodField()

    def get_type(self, obj):
        return dict(PLACES).get(str(obj.type))

    class Meta:
        model = DriverServiceOrder
        fields = ['driver', 'type']


class ServiceOrderSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):

        self.fields['equipments'] = serializers.SerializerMethodField()
        self.fields['drivers'] = serializers.SerializerMethodField()
        self.fields['contract'] = ContractSerializer()
        self.fields['cost_center'] = CostCenterSerializer()
        self.fields['work_logs'] = serializers.SerializerMethodField()
        self.fields['status'] = serializers.SerializerMethodField()
        self.fields['type'] = ServiceOrderTypeSerializer()
        self.fields['origin'] = SubsidiarySerializer()
        self.fields['destination'] = SubsidiarySerializer()
        self.fields['service_costs'] = serializers.SerializerMethodField()
        self.fields['workflow_values'] = serializers.SerializerMethodField()

        return super(ServiceOrderSerializer, self).to_representation(
            instance)

    def get_equipments(self, obj):
        result = []
        equipments_rel = EquipmentServiceOrder.objects\
            .filter(service_order=obj)\
            .order_by('type')
        try:
            if equipments_rel:
                serializer = EquipmentServiceOrderSerializer(equipments_rel, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    def get_drivers(self, obj):
        result = []
        drivers_rel = DriverServiceOrder.objects\
            .filter(service_order=obj)\
            .order_by('type')
        try:
            if drivers_rel:
                serializer = DriverServiceOrderSerializer(drivers_rel, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    def get_work_logs(self, obj):
        result = []
        work_logs_rel = WorkLog.objects\
            .filter(service_order=obj)\
            .order_by('created')

        try:
            if work_logs_rel:
                serializer = WorkLogSerializer(work_logs_rel, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    def get_workflow_values(self, obj):
        result = []
        request = self.context.get('request', None)
        print('request user', request)

        try:
            user_profile = UserProfile.objects.get(user=request.user)
            context = ContentType.objects.get_for_model(obj)
            model = '{}.{}'.format(context.app_label, context.model)
            process = Process.objects\
                .filter(module=model, organization=user_profile.organization, organization__isnull=False)\
                .order_by('order')
            serializer = ProcessSerializer(process, many=True, context={'context_id': obj.id})
            result = serializer.data
        except Exception as ex:
            print(ex)

        return result

    def get_service_costs(self, obj):
        result = None
        service_costs = ServiceCost.objects\
            .filter(service_order=obj)\
            .order_by('-created')

        try:
            if service_costs.exists():
                serializer = ServiceCostSerializer(service_costs, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    def get_status(self, obj):
        result = obj.get_status()
        return result

    class Meta:
        model = ServiceOrder
        fields = '__all__'


class ServiceOrderMinSerializer(serializers.ModelSerializer):

    drivers = serializers.SerializerMethodField()
    contract = ContractSerializer()
    cost_center = CostCenterSerializer()
    work_logs = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    provider = ProviderSerializer()

    def get_drivers(self, obj):
        result = []
        drivers_rel = DriverServiceOrder.objects\
            .filter(service_order=obj)\
            .order_by('type')
        try:
            if drivers_rel:
                serializer = DriverServiceOrderSerializer(drivers_rel, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    def get_work_logs(self, obj):
        result = []
        work_logs_rel = WorkLog.objects\
            .filter(service_order=obj)\
            .order_by('type')

        try:
            if work_logs_rel:
                serializer = WorkLogSerializer(work_logs_rel, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    def get_status(self, obj):
        result = {}
        return result

    class Meta:
        model = ServiceOrder
        fields = '__all__'


class CostTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CostType
        fields = '__all__'


class ServiceCostSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):

        self.fields['cost_type'] = CostTypeSerializer()
        return super(ServiceCostSerializer, self).to_representation(
            instance)

    class Meta:
        model = ServiceCost
        fields = '__all__'


class TrackingSerializer(serializers.ModelSerializer):
    service_order = ServiceOrderMinSerializer()

    class Meta:
        model = Tracking
        fields = '__all__'

