from django.contrib import admin
from .models import *


class TypeAdmin(admin.ModelAdmin):
    list_filter = ['type_parent']
    search_fields = ['name', 'code', 'description']
    list_display = ['name', 'code', 'type_parent', 'description']


class LocationAdmin(admin.ModelAdmin):
    list_filter = ['subsidiary']
    search_fields = ['name', 'code', 'description']
    list_display = ['name', 'code', 'subsidiary', 'description']

    class Media:
        URL_MAPS = 'https://maps.googleapis.com/maps/api/js?libraries=places&key='
        if hasattr(settings, 'GOOGLE_MAPS_API_KEY') \
                and settings.GOOGLE_MAPS_API_KEY:
            css = {
                'all': ('css/admin/location_picker.css',),
            }
            js = (
                '{}{}'.format(URL_MAPS, settings.GOOGLE_MAPS_API_KEY),
                'js/admin/location_picker.js',
            )


class WorkFlowInline(admin.StackedInline):
    model = WorkFlow
    extra = 0
    readonly_fields = ['code']


class ComponentLocationInline(admin.StackedInline):
    model = ComponentLocation
    extra = 0


class ComponentAdmin(admin.ModelAdmin):
    list_filter = ['type']
    search_fields = ['id', 'code_1', 'code_2', 'qr_code', 'description', 'observation']
    list_display = ['id', 'created', 'modified', 'subsidiary', 'code_1', 'code_2', 'qr_code', 'is_active']
    inlines = [WorkFlowInline, ComponentLocationInline]


class AttachedFilesAdmin(admin.ModelAdmin):
    list_filter = ['name']
    search_fields = ['name']
    list_display = ['name', 'value', 'code', 'component']


class OrderItemInline(admin.StackedInline):
    model = OrdersItem
    extra = 0


class OrderAdmin(admin.ModelAdmin):
    list_filter = ['str_state']
    list_display = ['id', 'quantity', 'create_data', 'str_date', 'str_state']


class OrderItemsAdmin(admin.ModelAdmin):
    list_filter = ['order', 'code_state']
    search_fields = ['name']
    list_display = ['order', 'code', 'name', 'code_state']


class WorkFlowLogAdmin(admin.ModelAdmin):
    # list_filter = ['component']
    # search_fields = ['component__id']
    list_display = ['component', 'process', 'code', 'value_1', 'editor_user', 'processed']


admin.site.register(Type, TypeAdmin)
admin.site.register(Location, LocationAdmin)
admin.site.register(Component, ComponentAdmin)
admin.site.register(AttachedFiles, AttachedFilesAdmin)
admin.site.register(WorkFlowLog, WorkFlowLogAdmin)
admin.site.register(Orders, OrderAdmin)
admin.site.register(OrdersItem, OrderItemsAdmin)
