from django.contrib import admin

from app_application.forms import ListGroupPermissionForm
from app_application.models import Application, List, ActionType, ListGroupPermission


class ListGroupPermissionAdmin(admin.ModelAdmin):
    list_display = [
        'group',
    ]
    form = ListGroupPermissionForm


class ActionTypeAdmin(admin.ModelAdmin):
    search_fields = [
        'code',
    ]
    list_display = [
        'code',
    ]


class ListInline(admin.TabularInline):
    model = List
    extra = 0


class ApplicationAdmin(admin.ModelAdmin):
    search_fields = [
        'name',
        'code',
        'description',
        'domain',
        'repository',
    ]
    list_display = [
        'name',
        'code',
        'description',
        'is_active',
    ]
    list_filter = ['organization', 'is_active']
    inlines = [
        ListInline,
        ]


admin.site.register(Application, ApplicationAdmin)
admin.site.register(ActionType, ActionTypeAdmin)
admin.site.register(ListGroupPermission, ListGroupPermissionAdmin)
