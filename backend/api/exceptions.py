from rest_framework import status
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework.exceptions import APIException


def api_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    # Now add the HTTP status code to the response.
    if response is None:
        response = Response({'errors': {exc.__class__.__name__: str(exc)}})
        response.status = status.HTTP_500_INTERNAL_SERVER_ERROR
    if isinstance(exc, APIException):
        if isinstance(exc.detail, dict):
            exc_detail = [v for k, v in exc.detail.items()][0][0]
            exc.detail = exc_detail
        response = Response({'errors': {exc.__class__.__name__: exc.detail}})
        response.status = exc.status_code
    return response
