from rest_framework import serializers

from app_general.serializers import SubsidiarySerializer, ProcessSerializer
from .models import *


class TypeSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        self.fields['type_parent'] = TypeSerializer()

        return super(TypeSerializer, self).to_representation(
            instance)

    class Meta:
        model = Type
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        self.fields['subsidiary'] = SubsidiarySerializer()

        return super(LocationSerializer, self).to_representation(
            instance)

    class Meta:
        model = Location
        fields = '__all__'


class AttachedFilesSerializer(serializers.ModelSerializer):

    class Meta:
        model = AttachedFiles
        fields = '__all__'


class MetaWorkflowSerializer(serializers.ModelSerializer):

    class Meta:
        model = MetaWorkflow
        fields = '__all__'


class ComponentServiceOrderSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        self.fields['component'] = ComponentSerializer()

        return super(ComponentServiceOrderSerializer, self).to_representation(
            instance)

    class Meta:
        model = ComponentServiceOrder
        fields = '__all__'


class WorkflowSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        self.fields['state'] = TypeSerializer()
        self.fields['process'] = ProcessSerializer()
        self.fields['files'] = serializers.SerializerMethodField()

        return super(WorkflowSerializer, self).to_representation(
            instance)

    def get_files(self, obj):
        result = None
        try:
            queryset = MetaWorkflow.objects.filter(workflow=obj, code='UPLOAD')
            if queryset.exists():
                serializer = MetaWorkflowSerializer(queryset, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    class Meta:
        model = WorkFlow
        fields = '__all__'


class ComponentSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):

        self.fields['location'] = LocationSerializer()
        self.fields['type'] = TypeSerializer()
        self.fields['subsidiary'] = SubsidiarySerializer()
        self.fields['subsidiary2'] = SubsidiarySerializer()
        self.fields['files'] = serializers.SerializerMethodField()
        self.fields['workflow'] = serializers.SerializerMethodField()
        self.fields['locations'] = serializers.SerializerMethodField()

        return super(ComponentSerializer, self).to_representation(
            instance)

    def get_files(self, obj):
        result = None
        try:
            queryset = AttachedFiles.objects.filter(component=obj)
            if queryset.exists():
                serializer = AttachedFilesSerializer(queryset, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    def get_workflow(self, obj):
        result = None
        try:
            queryset = WorkFlow.objects.filter(component=obj).order_by('process__order')
            if queryset.exists():
                serializer = WorkflowSerializer(queryset, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    def get_locations(self, obj):
        result = None
        try:
            queryset = ComponentLocation.objects.filter(component=obj).order_by('-created')
            if queryset.exists():
                serializer = ComponentLocationSerializer(queryset, many=True)
                result = serializer.data
        except Exception as ex:
            print(ex)
        return result

    class Meta:
        model = Component
        fields = '__all__'


class ComponentLocationSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        self.fields['location'] = LocationSerializer()
        return super(ComponentLocationSerializer, self).to_representation(
            instance)

    class Meta:
        model = ComponentLocation
        fields = '__all__'
