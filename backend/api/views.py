import time

from requests import request

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Request, TimingAnalysisData
from .serializers import RequestSerializer
from .decorators import handle_exception
from backend.settings import GOOGLE_API_KEY

STRATEGY = 'mobile'


class RequestViewSet(viewsets.ModelViewSet):
    """ API endpoint that allows to manage the request """
    serializer_class = RequestSerializer
    queryset = Request.objects.all()

    @action(methods=['get'], detail=True)
    @handle_exception
    def get_timing_data(self, req, pk):
        """ Get timing analysis data """
        metrics = {}
        # Check if data already exist
        timing_data = TimingAnalysisData.objects.filter(request_id=pk)
        if timing_data.exists():
            # If completed returns data
            if timing_data.first().completed:
                timing_analysis_data = TimingAnalysisData.objects.get(request_id=pk)
                metrics = timing_analysis_data.data
            # If not completed yet, inform the user the process is still running
            else:
                return Response({
                    'warnings': {
                        'loading':
                            'Data processing in progress, please wait for the process to complete ...'
                    }})
        # If data does not already exist we call google APIs
        else:
            timing_data = TimingAnalysisData.objects.create(request_id=pk)
            # Uncomment to simulate long task on server side
            # time.sleep(20)
            api_url = (f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?"
                       f"&strategy={STRATEGY}&url={timing_data.request.url}&key={GOOGLE_API_KEY}")
            # Send the HTTP request
            res = request(
                method='GET',
                url=api_url,
                timeout=60
            )
            json_res = res.json()
            # Collect metrics and update the model
            if 'loadingExperience' in json_res and 'metrics' in json_res['loadingExperience']:
                metrics = json_res['loadingExperience']['metrics']
                timing_data.data = metrics
                timing_data.completed = True
                timing_data.save()
        if not metrics:
            return Response({'warnings': {'nodata': 'No data found'}})
        return Response({'metrics': metrics})

    @handle_exception
    def create(self, request, *args, **kwargs):
        return super(RequestViewSet, self).create(request, args, kwargs)
