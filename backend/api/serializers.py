from rest_framework import serializers

import requests
from datetime import datetime
from http.client import HTTPConnection
from tld import get_tld

from .models import Request, Response, URLInfo, Status


class ResponseSerializer(serializers.ModelSerializer):
    """ Serializer for the Response model """
    class Meta:
        model = Response
        fields = '__all__'

    def to_representation(self, instance):
        formatted_date = instance.date.strftime('%a, %d %b %Y')
        instance.date = formatted_date
        return super(ResponseSerializer, self).to_representation(instance)


class URLInfoSerializer(serializers.ModelSerializer):
    """ Serializer for the URLInfo model """
    class Meta:
        model = URLInfo
        fields = '__all__'


class StatusSerializer(serializers.ModelSerializer):
    """ Serializer for the status model """
    message = serializers.CharField()

    class Meta:
        model = Status
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    """ Serializer for the Request model """
    responses = ResponseSerializer(many=True, read_only=True)
    status = StatusSerializer(read_only=True)
    url_info = URLInfoSerializer(read_only=True)

    class Meta:
        model = Request
        fields = '__all__'

    def create(self, validated_data):
        url = validated_data['url']
        # Send the HTTP request
        res = getattr(requests, validated_data['method'].lower())(
            url=url,
            timeout=30
        )
        instance = super(RequestSerializer, self).create(validated_data)
        # Handle response for details component
        responses = self._get_responses(instance, res)
        instance.responses.set(responses)
        # Handel URL for retrieving info
        url_info = self._get_url_info(instance, url)
        instance.url_info = url_info
        # Handle status from status component
        status_obj, created = Status.objects.get_or_create(
            code=res.status_code
        )
        instance.status = status_obj
        instance.save()
        return instance

    def _get_responses(self, instance, response):
        responses = []
        # When some redirects happen the response history takes trace of that
        response_list = [response] + response.history
        for r in response_list:
            date = datetime.strptime(r.headers['Date'], '%a, %d %b %Y %H:%M:%S %Z')
            response = Response(
                request=instance,
                protocol=HTTPConnection._http_vsn_str,
                status=r.status_code,
                reason=r.reason,
                date=date.strftime('%Y-%m-%d'),
                location=self._get_location(r.headers['location']) if 'location' in r.headers else "",
                server=r.headers['server'] if 'server' in r.headers else ""
            )
            response.save()
            responses.append(response)
        return responses

    def _get_url_info(self, instance, url):
        tld_obj = get_tld(url, as_object=True)
        url_info = URLInfo(
            request=instance,
            scheme=tld_obj.parsed_url.scheme,
            domain=tld_obj.fld,
            path=self._get_path(tld_obj)
        )
        url_info.save()
        return url_info

    @staticmethod
    def _get_path(tld_obj):
        path = tld_obj.parsed_url.path
        if not path:
            path = "/"
        else:
            # -1 not found
            dot_index = path.rfind(".")
            slash_index = path.rfind("/")
            if dot_index > slash_index:
                path = path[:slash_index]
        return path

    @staticmethod
    def _get_location(location):
        tld_obj = get_tld(location, as_object=True)
        return tld_obj.parsed_url.path
