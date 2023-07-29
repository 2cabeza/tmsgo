import json
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils.translation import ugettext_lazy as _
from logics.settings import SENDGRID_API_KEY, GOOGLE_RECAPTCHA_URL, GOOGLE_RECAPTCHA_KEY, SENDERS
from logics.utils import upload_file, RequestParamsFilterBackend

from .serializers import GroupSerializer, SubsidiarySerializer, UserProfileSerializer, \
    MetaDataProcessSerializer, ProviderSerializer, OrganizationSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.filters import OrderingFilter
from rest_framework import viewsets, status
import requests
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from .models import Subsidiary, UserProfile, MetaDataProcess, Provider


class MetaDataProcessViewSet(viewsets.ModelViewSet):
    queryset = MetaDataProcess.objects.all()
    serializer_class = MetaDataProcessSerializer

    def create(self, request):

        data = request.data.copy()
        context_type = data.get('context_type', None)
        process = data.get('process', None)

        data.pop('context_type')
        data.pop('process')

        for item in data:
            obj, created = self.queryset \
                .get_or_create(context_type=context_type,
                               process_id=process,
                               key=item
                               )
            obj.code = item
            obj.value = data.get(item)
            print('obj.value', obj.value)
            is_json = False
            if str(obj.value) == 'null':
                is_json = False
                obj.value = None
            elif isinstance(obj.value, bool):
                print('bool')
                is_json = False
                obj.value = str(data.get(item)).lower()
                print('obj.value is boolean', obj.value)
            elif isinstance(obj.value, str) or isinstance(obj.value, float) or isinstance(obj.value, int):
                print('str|float|int')
                is_json = False
            elif isinstance(obj.value, object) or isinstance(obj.value, list):
                print('object')
                is_json = True

            try:
                if is_json:
                    obj.value = json.dumps(data.get(item))
            except Exception as ex:
                print(ex)
            obj.editor_user = request.user
            obj.save()
        return Response(data, status=status.HTTP_202_ACCEPTED)
        # ids = []
        # try:
        #     for comp in component:
        #         id_ = comp.get('id')
        #         ids.append(id_)
        #         print('component', context_id, id_)
        #         obj, created = self.queryset \
        #             .get_or_create(component_id=id_,
        #                            service_order_id=context_id
        #                            )
        #         obj.key = 'component'
        #         obj.editor_user = request.user
        #         obj.save()
        #
        #     # item delete not exist
        #     to_delete = ComponentServiceOrder.objects\
        #         .filter(service_order=context_id)\
        #         .exclude(component_id__in=ids).delete()
        #
        #     obj_ = ComponentServiceOrder.objects.filter(service_order=context_id)
        #     serializer = self.serializer_class(obj_, many=True)
        #     return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

        # except Exception as ex:
        #     print(ex)
        #     return Response(ex, status=status.HTTP_400_BAD_REQUEST)


class SubsidiaryViewSet(viewsets.ModelViewSet):
    queryset = Subsidiary.objects.all()
    serializer_class = SubsidiarySerializer
    filter_backends = [OrderingFilter]


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer
    filter_backends = [RequestParamsFilterBackend, OrderingFilter]


class CustomAuthToken(ObtainAuthToken):
    """
    Custom export user token
    """
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        # create token
        token, created = Token.objects.get_or_create(user=user)
        # print(user.groups.get_queryset())
        serializer_group = GroupSerializer(user.groups.get_queryset(), many=True)
        # print(serializer_group.data)
        image = None
        profile = UserProfile.objects.get(user=user)
        provider = None
        organization = None
        if profile:
            image = str(profile.image)
            if profile.provider:
                serializer = ProviderSerializer(profile.provider, many=False)
                provider = serializer.data
            if profile.organization:
                serializer = OrganizationSerializer(profile.organization, many=False)
                organization = serializer.data

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'image': image,
            'provider': provider,
            'organization': organization,
            'fullname': '{} {}'.format(user.first_name, user.last_name),
            'username': user.username,
            'groups': serializer_group.data
        })


class MyProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def list(self, request, pk=None):
        user = get_object_or_404(self.queryset, user=request.user)
        serializer = self.serializer_class(user)
        return Response(serializer.data)


class SendMail(APIView):
    """
    Send mail by sendgrid
    """

    def post(self, request):
        data = request.POST.copy() if request.POST else request.data

        print('data', data)
        print('request', request)
        print('request data', request.data)
        print('request post', request.POST)
        env_key = data.get('env_key', '')
        recaptcha = data.get('recaptcha', '')
        security = data.get('security', 1)
        targets_ = data.get('targets', None)
        targets = []
        if targets_:
            targets = targets_.split(',')

        if security == 1:
            status_recaptcha, error, message = validate(recaptcha, env_key)
        else:
            status_recaptcha = True

        if status_recaptcha:
            print('validate')

            # subject mail
            subject = 'Contact Form'
            if data['subject']:
                subject = data['subject']

            # remove params of list
            print(data)
            del data['date_send']
            del data['status']
            del data['subject']
            del data['recaptcha']
            del data['env_key']
            try:
                del data['security']
            except Exception as ex:
                print(ex)

            if targets_:
                del data['targets']

            html = '<h2>Ha recibido el siguiente mensaje:</h2>'
            for attr, value in data.items():
                if str(value) != '-1':
                    html += '<p><strong>{}: </strong>{}</p>'.format(attr, value)
            print(html)

            # add new target
            print('senders', SENDERS[env_key])
            targets.append(SENDERS[env_key])

            message = Mail(
                from_email=SENDERS[env_key],
                to_emails=targets,
                subject=subject,
                html_content=html)
            try:
                sendgrid_key = SENDGRID_API_KEY[env_key]
                sg = SendGridAPIClient(sendgrid_key)
                response = sg.send(message)
                print('status_code', response.status_code)
                print('body', response.body)
                print('headers', response.headers)
            except Exception as e:
                print('no validate')
                print('send error', e)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        return Response(data='Sended', status=status.HTTP_200_OK)


def validate(recaptcha, key):
    print('call validate function', recaptcha, key)
    error = None
    status = False
    message = ''
    try:
        url = GOOGLE_RECAPTCHA_URL
        data = {"secret": GOOGLE_RECAPTCHA_KEY[key], "response": recaptcha}
        response = requests.post(url, data)

        if response.status_code == 200:
            response = response.json()
            if response['success']:
                print(response['success'])
                status = True
                message = response['success']
            else:
                error = _('Error: {}'.format(response['error-codes'][0]))
        else:
            error = _('Something wrong with reCaptcha. Error code: {}'.format(response.status_code))
    except Exception as ex:
        error = _('Error: {}'.format(str(ex)))

    if error:
        error = {'errors': error}
    return status, error, message


class Iptv(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
        """
        IPTV format.
        """
        # url = uploadFile(file_path='data1.txt')
        # url = uploadFile(file_path='data1.txt', folder='profile')
        url = upload_file(file_path='data1.txt', folder='profile', filename='hola5.txt')
        # url = uploadFile(file_path='data1.txt', filename='media/hola3.txt')
        return Response(url)
        # CATEGORIES
        url = 'http://xdgo.live:8080/player_api.php?username=JorgeMarquez&password=frAzNGHBQ6&action=get_live_categories'
        payload = ""
        headers = {
            'Content-Type': "application/json",
            'Accept-Version': "2.0.0"}

        response = requests.post(url, data=payload, headers=headers)
        response = json.loads(response.text)
        categories = {item.get('category_id'): item.get('category_name') for item in response}

        # CHANNELS
        url = 'http://xdgo.live:8080/player_api.php?username=JorgeMarquez&password=frAzNGHBQ6&action=get_live_streams'
        headers = {
            'Content-Type': "application/json",
            'Accept-Version': "2.0.0"}

        response = requests.post(url, data=payload, headers=headers)
        response = json.loads(response.text)
        # print('channels', response)

        m3u = '#EXTM3U' + '\n'
        for channel in response:
            m3u += '#EXTINF:-1 tvg-id="{}" tvg-logo="{}" group-title="{}",{}'\
                    .format('x',
                            channel.get('stream_icon'),
                            categories.get(channel.get('category_id')),
                            channel.get('name')) + '\n'
            m3u += 'http://xdgo.live:8080/JorgeMarquez/frAzNGHBQ6/{}'.format(channel.get('stream_id')) + '\n'
        print('m3u', m3u)

        return Response(data=m3u, status=status.HTTP_200_OK, content_type='text/plain')


