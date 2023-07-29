import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets, status, generics
from .serializers import *
from .models import *


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(virtual=False)
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    search_fields = ['style', 'state']


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(parent=None, virtual=False)
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    search_fields = ('name', 'sku', 'description')


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.filter(parent=None)
    serializer_class = BrandSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]


class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.filter(parent=None)
    serializer_class = SlideSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]


class NumberInFilter(django_filters.BaseInFilter, django_filters.NumberFilter):
    pass


class ProductFilter(django_filters.FilterSet):
    id_in = NumberInFilter(field_name='id', lookup_expr='in')

    class Meta:
        model = Product
        fields = ['id_in', 'categories__name', 'categories__id', 'brand__name', 'brand__id']


class ProductView(generics.ListAPIView):
    queryset = Product.objects.filter(parent=None, virtual=False)
    serializer_class = ProductSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter, django_filters.rest_framework.DjangoFilterBackend)
    search_fields = ('name', 'sku', 'slug', 'description', 'id', 'categories__name', 'brand__name')
    filter_class = ProductFilter
