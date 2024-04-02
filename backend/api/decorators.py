from functools import wraps
from rest_framework.response import Response


def handle_exception(to_be_executed):
    @wraps(to_be_executed)
    def wrapper(*args, **kwargs):
        try:
            return to_be_executed(*args, **kwargs)
        except Exception as e:
            return Response(
                {'errors': {e.__class__.__name__: str(e)}}
            )
    return wrapper
