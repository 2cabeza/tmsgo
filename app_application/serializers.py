from .models import *
from app_general.serializers import *


class ApplicationSerializer(serializers.ModelSerializer):
    lists = serializers.SerializerMethodField()

    def get_lists(self, obj):
        request = self.context['request']
        full = request.GET.get('full', 1)
        if int(full) == 1:
            queryset = List.objects.filter(parent_list=None,
                                           application__code=obj.code
                                           )
            if queryset.exists():
                serializer = ListSerializer(queryset, many=True, context={'request': request})
                return serializer.data
            else:
                return []

        else:
            return []

    class Meta:
        model = Application
        fields = '__all__'


class ActionTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ActionType
        fields = '__all__'


class ListSerializer(serializers.ModelSerializer):
    childs = serializers.SerializerMethodField()
    action_type = ActionTypeSerializer()

    def get_childs(self, obj):
        kwargs = {}
        request = self.context.get('request', None)
        pk = self.context.get('pk', None)
        # print('us:', request.user, 'pk', pk)
        if pk:
            kwargs.update({'application__code': pk})
        queryset = List.objects\
            .filter(
                **kwargs,
                parent_list=obj,
                listgrouppermission__group__in=request.user.groups.get_queryset(),
            ).order_by('order')
        # print('query', queryset.query)

        if queryset.exists():
            serializer = ListSerializer(queryset, many=True, context={'request': request,
                                                                      'pk': pk
                                                                      })
            return serializer.data
        else:
            return None

    class Meta:
        model = List
        fields = '__all__'
