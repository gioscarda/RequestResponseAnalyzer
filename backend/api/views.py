import requests

from rest_framework import viewsets
from rest_framework.exceptions import APIException, ErrorDetail
from rest_framework.decorators import action
from rest_framework.response import Response

from backend.settings import GOOGLE_API_KEY
from .models import Request, TimingAnalysisData
from .serializers import RequestSerializer

STRATEGY = 'mobile'


class RequestViewSet(viewsets.ModelViewSet):
    """ API endpoint that allows to manage the request """
    serializer_class = RequestSerializer
    queryset = Request.objects.all()

    @action(methods=['get'], detail=True)
    def get_timing_data(self, request, pk=None):
        """ Get timing analysis data """
        # Check if data already exist
        timing_data = TimingAnalysisData.objects.filter(request_id=pk)
        if timing_data.exists():
            if timing_data.first().completed:
                timing_analysis_data = TimingAnalysisData.objects.get(request_id=pk)
                return Response(timing_analysis_data.data)
            else:
                # TODO
                pass
        else:
            # If data does not already exist we call google APIs
            metrics = {}
            req = Request.objects.get(id=pk)
            tad = TimingAnalysisData.objects.create(request=req)
            res = requests.get(f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?"
                               f"&strategy={STRATEGY}&url={req.url}&key={GOOGLE_API_KEY}", timeout=30)
            json_res = res.json()
            if 'loadingExperience' in json_res and 'metrics' in json_res['loadingExperience']:
                metrics = json_res['loadingExperience']['metrics']
                tad.data = metrics
                tad.completed = True
                tad.save()
            return Response(metrics)

    def create(self, request, *args, **kwargs):
        try:
            return super(RequestViewSet, self).create(request, args, kwargs)
        except Exception as e:
            # Uniforming all exceptions to APIException
            if not isinstance(e, APIException):
                detail = ErrorDetail(str(e))
                e = APIException(detail=detail)
            raise e
