from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from app_purchase_order.models import PurchaseOrder, PurchaseOrderDetail, Reception, \
    ReceptionDetail, ImportFileOrderDetail


class PurchaseOrderDetailInline(admin.TabularInline):
    model = PurchaseOrderDetail
    extra = 0


class PurchaseOrderAdmin(admin.ModelAdmin):
    search_fields = [
        'id',
        'description'
    ]
    list_display = [
        'id',
        'created',
        'modified',
        'description',
        'is_active'
    ]
    inlines = [PurchaseOrderDetailInline]


class PurchaseOrderDetailAdmin(admin.ModelAdmin):
    search_fields = [
        'id',
        'description',
        'code_1'
    ]
    list_display = [
        'id',
        'purchase_order',
        'created',
        'description',
        'quantity',
        'price_1',
        'is_active'
    ]


class ReceptionDetailInline(admin.TabularInline):
    model = ReceptionDetail
    extra = 0


class ReceptionAdmin(admin.ModelAdmin):
    search_fields = [
        'id',
        'observation'
    ]
    list_display = [
        'id',
        'created',
        'modified',
        'status',
        'patent',
        'company'
    ]
    inlines = [ReceptionDetailInline]


class ReceptionDetailAdmin(admin.ModelAdmin):
    search_fields = [
        'id',
        'description',
        'code_1'
    ]
    list_display = [
        'id',
        'created',
        'reception',
        'purchase_order_detail',
        'quantity',
        'is_active'
    ]


class ImportFileOrderDetailAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'created',
    ]


admin.site.register(PurchaseOrder, PurchaseOrderAdmin)
admin.site.register(PurchaseOrderDetail, PurchaseOrderDetailAdmin)
admin.site.register(Reception, ReceptionAdmin)
admin.site.register(ReceptionDetail, ReceptionDetailAdmin)
admin.site.register(ImportFileOrderDetail, ImportFileOrderDetailAdmin)
