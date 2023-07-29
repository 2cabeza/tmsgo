from django.contrib import admin
from .models import *


class ContractAdmin(admin.ModelAdmin):
    search_fields = [
        'code',
    ]
    list_display = [
        'code',
        'created',
    ]


class BrandAdmin(admin.ModelAdmin):
    search_fields = [
        'name', 'code'
    ]
    list_display = [
        'name', 'code'
    ]


class EquipmentTypeAdmin(admin.ModelAdmin):
    search_fields = [
        'name',
    ]
    list_display = [
        'name',
        'created',
    ]


class ModelAdmin(admin.ModelAdmin):
    search_fields = [
        'name', 'code', 'brand__name'
    ]
    list_display = [
        'name', 'code', 'brand', 'type', 'max_weight', 'max_volume', 'efficiency'
    ]
    list_filter = ['brand', 'type']


class EquipmentAdmin(admin.ModelAdmin):
    search_fields = [
        'patent',
    ]
    list_display = [
        'patent',
        'type',
        'circulation_permit_date',
        'model'
    ]
    list_filter = ['type', 'model__brand']
    autocomplete_fields = ['model']


class DriverAdmin(admin.ModelAdmin):
    search_fields = [
        # 'user__email',
        # 'user__first_name',
        # 'user__last_name',
        'license_date',
    ]

    list_display = [
        # 'user__first_name',
        # 'user__last_name',
        # 'user__email',
        'user_profile',
        'license_date',
        # 'user__is_active',
    ]
    autocomplete_fields = ['user_profile']


class CostCenterAdmin(admin.ModelAdmin):
    search_fields = [
        'name',
        'address',
        'contact'
    ]
    list_display = [
        'name',
        'address',
        'contact'
    ]


class ServiceOrderTypeAdmin(admin.ModelAdmin):
    search_fields = [
        'name',
        'code'
    ]
    list_display = [
        'name',
        'code',
    ]


class TrackingAdmin(admin.ModelAdmin):
    search_fields = [
        'service_order',
    ]
    list_display = [
        'service_order',
        'modified',
        'latitude',
        'longitude'
    ]


class DriverServiceOrderInline(admin.TabularInline):
    model = DriverServiceOrder
    extra = 0


class EquipmentServiceOrderInline(admin.TabularInline):
    model = EquipmentServiceOrder
    extra = 0


class WorkLogInline(admin.TabularInline):
    model = WorkLog
    extra = 0


class ServiceCostInline(admin.TabularInline):
    model = ServiceCost
    extra = 0


class ServiceOrderAdmin(admin.ModelAdmin):
    search_fields = [
        'id',
        'address',
        'office_guide',
        'contract__code'
    ]
    list_display = [
        'id',
        'service_date',
        'cost_center',
        'address',
        'office_guide',
        'contract',
        'estimated_closing_date',
        'amount',
        'priority',
        'is_active',
    ]
    list_filter = ['cost_center', 'contract', 'priority']
    inlines = [
        EquipmentServiceOrderInline,
        DriverServiceOrderInline,
        ServiceCostInline,
        WorkLogInline,
        ]


class WorkLogTypeAdmin(admin.ModelAdmin):
    search_fields = [
        'name', 'code'
    ]
    list_display = [
        'name', 'code'
    ]


class WorkLogAdmin(admin.ModelAdmin):
    search_fields = [
        # 'service_order__id',
        'type__name',
        'value',
        'description'
    ]
    list_display = [
        'service_order',
        'type',
        'value',
    ]
    list_filter = ['type']


class CostTypeAdmin(admin.ModelAdmin):
    search_fields = [
        'name', 'code'
    ]
    list_display = [
        'name', 'code', 'order'
    ]


class ServiceCostAdmin(admin.ModelAdmin):
    search_fields = [
        # 'service_order__id',
        'cost_type__name',
        'value1',
        'description'
    ]
    list_display = [
        'id',
        'equipment',
        'service_order',
        'cost_type',
        'value1',
        'value2',
    ]
    list_filter = ['cost_type']


admin.site.register(Contract, ContractAdmin)
admin.site.register(EquipmentType, EquipmentTypeAdmin)
admin.site.register(Equipment, EquipmentAdmin)
admin.site.register(Driver, DriverAdmin)
admin.site.register(ServiceOrder, ServiceOrderAdmin)
admin.site.register(WorkLogType, WorkLogTypeAdmin)
admin.site.register(WorkLog, WorkLogAdmin)
admin.site.register(CostCenter, CostCenterAdmin)
admin.site.register(ServiceCost, ServiceCostAdmin)
admin.site.register(CostType, CostTypeAdmin)
admin.site.register(Brand, BrandAdmin)
admin.site.register(Model, ModelAdmin)
admin.site.register(ServiceOrderType, ServiceOrderTypeAdmin)
admin.site.register(Tracking, TrackingAdmin)


