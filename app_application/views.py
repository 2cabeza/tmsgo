from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.filters import OrderingFilter
from rest_framework.views import APIView

from logics.utils import IsActiveFilterBackend, CodeRetrieveBackend
from .serializers import *
from .models import *
from rest_framework.response import Response


class ListView(APIView):
    """
    List
    """
    def get(self, request):
        print('user:', request.user)
        code = request.GET.get('code', None)
        app = request.GET.get('app', None)
        kwargs = {}
        if code:
            kwargs.update({'code': code})
        if app:
            kwargs.update({'application__code': app})

        queryset = List.objects.filter(**kwargs).first()
        serializer = ListSerializer(queryset, many=False, context={'request': request})
        data = serializer.data

        return Response(data=data)


class ApplicationViewSet(viewsets.ModelViewSet, CodeRetrieveBackend):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    filter_backends = [OrderingFilter, IsActiveFilterBackend]
