import uuid

from rest_framework import status as http_status
from rest_framework.test import APITestCase

from .models import Request, Response, TimingAnalysisData, URLInfo, Status


class RequestAPITests(APITestCase):
    """ Testing RequestViewSet methods """
    def setUp(self):
        # Call API create endpoint
        data = {'method': 'GET', 'url': 'https://mail.google.com/mail/u/0/#inbox'}
        self.response = self.client.post('/api/HTTP/', data, format='json')

    def test_create(self):
        """ Ensure all models are correctly created """
        # Test API endpoint response
        self.assertEqual(self.response.status_code, http_status.HTTP_201_CREATED)
        self.assertTrue('id' in self.response.data)
        req_id = self.response.data['id']
        # Test Request
        req_qs = Request.objects.filter(id=req_id)
        self.assertTrue(req_qs.exists())
        req = req_qs.get()
        self.assertEqual(req.method, self.response.data['method'])
        self.assertEqual(req.url, self.response.data['url'])
        self.assertTrue(isinstance(req.id, uuid.UUID))
        # Test Status
        request_status = Status.objects.filter(requests__id=req.id)
        self.assertTrue(request_status.exists())
        self.assertEqual(request_status.get().code, self.response.data['status']['code'])
        self.assertEqual(request_status.get().message, self.response.data['status']['message'])
        # Test URL info
        url_info = URLInfo.objects.filter(request__id=req.id)
        self.assertTrue(url_info.exists())
        self.assertEqual(url_info.get().domain, self.response.data['url_info']['domain'])
        self.assertEqual(url_info.get().scheme, self.response.data['url_info']['scheme'])
        self.assertEqual(url_info.get().path, self.response.data['url_info']['path'])
        # Test Response
        responses = self.response.data['responses']
        response_objects = Response.objects.filter(request__id=req.id)
        self.assertEqual(response_objects.count(), len(responses))
        for res in responses:
            res_qs = Response.objects.filter(id=res['id'])
            self.assertTrue(res_qs.exists())
            res_obj = res_qs.get()
            self.assertEqual(res_obj.protocol, res['protocol'])
            self.assertEqual(res_obj.status, res['status'])
            self.assertEqual(res_obj.reason, res['reason'])
            self.assertEqual(res_obj.date.strftime('%a, %d %b %Y'), res['date'])
            if 'location' in res:
                self.assertEqual(res_obj.location, res['location'])
            self.assertEqual(res_obj.server, res['server'])
            self.assertEqual(req.id, res['request'])

    def test_retrieve_detail(self):
        """ Ensure all data are correctly retrieved """
        # Call API endpoint
        req_response = self.client.get(f"/api/HTTP/{self.response.data['id']}/", format='json')
        # Test API response
        self.assertEqual(req_response.status_code, http_status.HTTP_200_OK)
        self.assertTrue('id' in req_response.data)
        req_id = req_response.data['id']
        # Test Request
        req_qs = Request.objects.filter(id=req_id)
        self.assertTrue(req_qs.exists())
        req = req_qs.get()
        self.assertEqual(req.method, self.response.data['method'])
        self.assertEqual(req.url, self.response.data['url'])
        self.assertTrue(isinstance(req.id, uuid.UUID))
        # Test Status
        request_status = Status.objects.filter(requests__id=req.id)
        self.assertTrue(request_status.exists())
        self.assertEqual(request_status.get().code, self.response.data['status']['code'])
        self.assertEqual(request_status.get().message, self.response.data['status']['message'])
        # Test URL info
        url_info = URLInfo.objects.filter(request__id=req.id)
        self.assertTrue(url_info.exists())
        self.assertEqual(url_info.get().domain, self.response.data['url_info']['domain'])
        self.assertEqual(url_info.get().scheme, self.response.data['url_info']['scheme'])
        self.assertEqual(url_info.get().path, self.response.data['url_info']['path'])
        # Test Response
        responses = self.response.data['responses']
        response_objects = Response.objects.filter(request__id=req.id)
        self.assertEqual(response_objects.count(), len(responses))
        for res in responses:
            res_qs = Response.objects.filter(id=res['id'])
            self.assertTrue(res_qs.exists())
            res_obj = res_qs.get()
            self.assertEqual(res_obj.protocol, res['protocol'])
            self.assertEqual(res_obj.status, res['status'])
            self.assertEqual(res_obj.reason, res['reason'])
            self.assertEqual(res_obj.date.strftime('%a, %d %b %Y'), res['date'])
            if 'location' in res:
                self.assertEqual(res_obj.location, res['location'])
            self.assertEqual(res_obj.server, res['server'])
            self.assertEqual(req.id, res['request'])

    def test_get_timing_analysis_data(self):
        """ Ensure timing analysis data retrieved from Google APIs """
        # Call APIs endpoint
        tda_response = self.client.get(f"/api/HTTP/{self.response.data['id']}/get_timing_data/", format='json')
        # Test APIs endpoint response
        self.assertEqual(tda_response.status_code, http_status.HTTP_200_OK)
        tda_qs = TimingAnalysisData.objects.filter(request__id=self.response.data['id'])
        self.assertTrue(tda_qs.exists())
        tda = tda_qs.get()
        # Sync test so 'completed' should be True
        self.assertTrue(tda.completed)
        self.assertIsNotNone(tda.data)
        # Check metrics
        for k in tda.data:
            v = tda.data[k]
            self.assertTrue('percentile' in v)
            self.assertTrue('distributions' in v)
            for dist in v['distributions']:
                self.assertTrue('min' in dist)
                self.assertTrue('proportion' in dist)
            self.assertTrue('category' in v)


class SecurityAPITests(APITestCase):
    """ Testing security in APIs endpoints """

    def test_csrf_protection(self):
        # Obtain a CSRF token.
        # response = self.client.get('/api')
        # self.assertEqual(response.status_code, http_status.HTTP_200_OK)
        # csrftoken = response.cookies['csrftoken']
        # # Interact with the API.
        # data = {'method': 'GET', 'url': 'https://mail.google.com/mail/u/0/#inbox'}
        # response = self.client.post('/api/HTTP/', data, format='json', headers={'X-CSRFToken': csrftoken})
        # self.assertEqual(response.status_code, http_status.HTTP_200_OK)
        pass

    def test_cors_protection(self):
        pass

    def test_ddos_protection(self):
        pass

    def test_anonymous_users_protection(self):
        pass
