import uuid
from django.db import models

HTTP_METHODS = (
    ('GET', 'GET'),
    ('POST', 'POST'),
    ('PUT', 'PUT'),
    ('DELETE', 'DELETE'),
    ('INFO', 'INFO'),
    ('DUMB', 'DUMB')
)


class Status(models.Model):
    """ Model for storing status data """
    code = models.PositiveSmallIntegerField()

    @property
    def message(self):
        if self.code in range(200, 300):
            return 'Everything is fine!'
        elif self.code in range(300, 400):
            return 'Your request has been redirected!'
        elif self.code in range(400, 500):
            return 'Some error occurred on the client!'
        elif self.code in range(500, 600):
            return 'Some error occurred on the server!'
        else:
            return "Unknown status code"


class Request(models.Model):
    """ Model for storing requests data """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    method = models.CharField(max_length=10, choices=HTTP_METHODS)
    url = models.URLField(max_length=500)
    status = models.ForeignKey('Status', on_delete=models.CASCADE, related_name='requests', null=True)


class Response(models.Model):
    """ Model for storing responses data """
    request = models.ForeignKey('Request', on_delete=models.CASCADE, related_name='responses')
    protocol = models.CharField(default='HTTP/1.1', max_length=10)
    status = models.PositiveSmallIntegerField()
    reason = models.CharField(max_length=50)
    date = models.DateField()
    location = models.CharField(max_length=255)
    server = models.CharField(max_length=100)


class URLInfo(models.Model):
    """ Model for storing URL data """
    request = models.OneToOneField('Request', on_delete=models.CASCADE, related_name='url_info')
    domain = models.CharField(max_length=255)
    scheme = models.CharField(max_length=4)
    path = models.CharField(max_length=255)


class TimingAnalysisData(models.Model):
    """ Model for storing Timing analysis data """
    request = models.OneToOneField('Request', on_delete=models.CASCADE, related_name='timing_analysis_data')
    data = models.JSONField(null=True)
    completed = models.BooleanField(default=False)
