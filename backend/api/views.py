from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

import requests

from backend.settings import GOOGLE_API_KEY
from .models import Request, TimingAnalysisData
from .serializers import RequestSerializer


class RequestViewSet(viewsets.ModelViewSet):
    """ API endpoint that allows to manage the request """
    serializer_class = RequestSerializer
    queryset = Request.objects.all()

    @action(methods=['get'], detail=True)
    def get_timing_data(self, request, pk=None):
        """ Get timing analysis data """
        # Check if data already exists
        if TimingAnalysisData.objects.filter(request_id=pk).exists():
            timing_analysis_data = TimingAnalysisData.objects.get(request_id=pk)
            return Response(timing_analysis_data.data)
        # If data does not already exist we call google APIs
        metrics = {}
        req = Request.objects.get(id=pk)
        res = requests.get(f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?"
                           f"&strategy=mobile&url={req.url}&key={GOOGLE_API_KEY}", timeout=30)
        json_res = res.json()
        if 'loadingExperience' in json_res and 'metrics' in json_res['loadingExperience']:
            metrics = json_res['loadingExperience']['metrics']
            TimingAnalysisData.objects.create(request=req, data=metrics)
        return Response(metrics)
