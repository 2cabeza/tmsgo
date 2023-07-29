from logics.utils import date_format
from django.db.models.functions import datetime
from app_transport_services.models import ServiceOrder
import json

from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group


class OrganizationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organization
        fields = '__all__'


class RegionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Region
        fields = '__all__'


class ProvinceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Province
        fields = '__all__'


class CommuneSerializer(serializers.ModelSerializer):

    class Meta:
        model = Commune
        fields = '__all__'


class RegionNodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Region
        fields = '__all__'


class ProvinceNodeSerializer(serializers.ModelSerializer):
    region = RegionNodeSerializer()

    class Meta:
        model = Province
        fields = '__all__'


class CommuneNodeSerializer(serializers.ModelSerializer):
    province = ProvinceNodeSerializer()

    class Meta:
        model = Commune
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = '__all__'


class FieldNameSerializer(serializers.ModelSerializer):

    class Meta:
        model = FieldName
        fields = '__all__'


class ProcessSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        self.fields['field_list'] = serializers.SerializerMethodField()

        return super(ProcessSerializer, self).to_representation(
            instance)

    def get_field_list(self, obj):
        result = None
        context_id = self.context.get('context_id', None)
        try:
            queryset = FieldName.objects.filter(process=obj, is_visible=True).order_by('order')
            print('queryset', queryset)
            print('context_id', context_id)
            if queryset.exists():
                if context_id:
                    for field in queryset:
                        try:
                            # get value input user
                            metadata = MetaDataProcess.objects.get(process=obj, context_type=context_id, key=field.key)
                            field.value = json.loads(json.dumps(metadata.value))
                        except Exception as ex:
                            print(ex)
                serializer = FieldNameSerializer(queryset, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    class Meta:
        model = Process
        fields = '__all__'


class SubsidiarySerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        self.fields['commune'] = CommuneNodeSerializer()
        self.fields['parent_subsidiary'] = SubsidiarySerializer()

        return super(SubsidiarySerializer, self).to_representation(
            instance)

    class Meta:
        model = Subsidiary
        fields = '__all__'


class UserShortSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserShortSerializer(many=False)

    class Meta:
        model = UserProfile
        fields = '__all__'


class MetaDataProcessSerializer(serializers.ModelSerializer):
    editor_user = UserShortSerializer(many=False)

    class Meta:
        model = MetaDataProcess
        fields = '__all__'


class ProviderSerializer(serializers.ModelSerializer):
    
    def to_representation(self, instance):
        self.fields['featured'] = serializers.SerializerMethodField()
        return super(ProviderSerializer, self).to_representation(
        instance)
        
    def get_featured(self, obj):
        featured = None
        from datetime import datetime
        date_today = datetime.now()
        month_first_day = date_format(date_today.replace(day=1, hour=0, minute=0, second=0, microsecond=0), 'min')
        print(month_first_day)
        featured = {
            'qty_services': 0,
            'qty_service_period': 0
        }
        try:
            queryset = ServiceOrder.objects.filter(provider=obj, service_date__gte=month_first_day)
            if queryset.exists:
                qty = len(queryset)
                featured.update({'qty_services': qty})
                if obj.min_amount_service > 0:
                    period = (qty * 100) / obj.min_amount_service
                    if period > 0:
                        period = round(period, 1)
                    featured.update({'qty_service_period': period})
            print(queryset)
        except Exception as ex:
            print(ex)

        return featured

    class Meta:
        model = Provider
        fields = '__all__'



