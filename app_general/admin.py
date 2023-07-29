from django.contrib import admin
from django.utils.html import format_html

from .forms import ColumnAttrForm
from .models import *


class TerritorialOrganizationAdmin(admin.ModelAdmin):
    list_display = ['description', 'version_code', 'is_active']


class RegionAdmin(admin.ModelAdmin):
    search_fields = ['region', 'code', 'capital']
    list_display = ['region', 'code', 'capital', 'territorial_organization']


class ProvinceAdmin(admin.ModelAdmin):
    list_filter = ['region']
    search_fields = ['province', 'region__region']
    list_display = ['province', 'region']


class CommuneAdmin(admin.ModelAdmin):
    list_filter = ['province', 'province__region']
    search_fields = ['commune', 'province__province']
    list_display = ['commune', 'province']


class OrganizationAdmin(admin.ModelAdmin):
    search_fields = [
        'name',
    ]
    list_display = [
        'name',
        'created',
    ]


class ProviderAdmin(admin.ModelAdmin):
    list_filter = ['is_active', 'commune__province__region']
    search_fields = ['name', 'address']
    list_display = ['name', 'code', 'parent_provider', 'commune', 'commune', 'is_public', 'is_active']
    autocomplete_fields = ['commune']


class UserProfileAdmin(admin.ModelAdmin):
    search_fields = [
        'user__first_name',
        'user__last_name',
        'ni',

    ]
    list_display = [
        'user',
        'ni',
        'personal_email',
        'personal_phone',
        'sex'
    ]


class SubsidiaryAdmin(admin.ModelAdmin):
    search_fields = [
        'name',
        'contact',
        'address',
        'commune__province__region',
        'commune'
    ]
    list_display = [
        'name',
        'address',
        'commune',
        'parent_subsidiary',
        'is_active'
    ]
    list_filter = ['commune__province__region', 'commune']
    autocomplete_fields = ['commune']

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


class FieldNameInline(admin.StackedInline):
    model = FieldName
    extra = 0
    form = ColumnAttrForm

    # def get_form(self, request, obj=None, **kwargs):
    #     form = super(FieldNameAdmin, self).get_form(request, obj, **kwargs)
    #     print('ENTRA', form.base_fields)
    #     form.base_fields['column_attr'].initial = {'size-xs': '12', 'size-md': '6', 'size-lg': '6'}
    #     return form


class ProcessAdmin(admin.ModelAdmin):
    search_fields = [
        'modulo',
        'code',
        'description'
    ]
    list_display = [
        'module',
        'organization',
        'code',
        'order',
        'description'
    ]
    list_filter = ['module', 'organization']
    inlines = [FieldNameInline]


class MetaDataProcessAdmin(admin.ModelAdmin):
    search_fields = [
        'key',
        'code',
        'context_type'
    ]
    list_display = [
        'id',
        'created',
        'modified',
        'key',
        'code',
        'context_type',
        'editor_user',
        'process'
    ]
    list_filter = ['process', 'context_type']


class FieldsPermissionAdmin(admin.ModelAdmin):
    search_fields = [
        'code',
        'description'
    ]
    list_display = [
        'code',
        'description'
    ]


admin.site.register(TerritorialOrganization, TerritorialOrganizationAdmin)
admin.site.register(Region, RegionAdmin)
admin.site.register(Province, ProvinceAdmin)
admin.site.register(Commune, CommuneAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Subsidiary, SubsidiaryAdmin)
admin.site.register(Process, ProcessAdmin)
admin.site.register(FieldsPermission, FieldsPermissionAdmin)
admin.site.register(Provider, ProviderAdmin)
admin.site.register(MetaDataProcess, MetaDataProcessAdmin)
