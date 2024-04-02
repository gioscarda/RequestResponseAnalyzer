from functools import wraps
from rest_framework.response import Response


def handle_exception(to_be_executed):
    @wraps(to_be_executed)
    def wrapper(*args, **kwargs):
        try:
            return to_be_executed(*args, **kwargs)
        except Exception as e:
            try:
                error = e.detail
            except:
                error = {'error': str(e)}
            return Response(
                {'errors': error}
            )
    return wrapper
