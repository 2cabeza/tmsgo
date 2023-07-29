from django.contrib import admin


# Register your models here.
from app_catalog.forms import ProductAdminForm, MyModelForm
from app_catalog.models import *


class CategoryAdmin(admin.ModelAdmin):
    list_filter = ['name']
    search_fields = ['name']
    list_display = ['name', 'slug', 'parent', 'style', 'state']
    form = MyModelForm


class MetaDataInline(admin.StackedInline):
    model = MetaData
    extra = 0


class ProductAdmin(admin.ModelAdmin):
    list_filter = ['currency', 'categories']
    search_fields = ['name', 'description', 'sku']
    list_display = ['name', 'brand', 'currency', 'short_description', 'slug', 'parent', 'state']
    inlines = [MetaDataInline]
    form = ProductAdminForm


class BrandAdmin(admin.ModelAdmin):
    list_filter = ['name']
    search_fields = ['name']
    list_display = ['name', 'slug', 'parent', 'state']


class SlideAdmin(admin.ModelAdmin):
    list_filter = ['name']
    search_fields = ['name']
    list_display = ['id', 'name', 'parent', 'state']


class ImagesAdmin(admin.ModelAdmin):
    list_filter = ['code']
    search_fields = ['name', 'image']
    list_display = ['name', 'code', 'image']


class ImportFileAdmin(admin.ModelAdmin):
    list_filter = ['uploaded']
    search_fields = ['description']
    list_display = ['id', 'created', 'modified', 'description', 'file', 'uploaded']


admin.site.register(Product, ProductAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Brand, BrandAdmin)
admin.site.register(Images, ImagesAdmin)
admin.site.register(ImportFile, ImportFileAdmin)
admin.site.register(Slide, SlideAdmin)

