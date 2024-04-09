from django.conf import settings
from rest_framework.authentication import SessionAuthentication


class SessionCSRFAuthentication(SessionAuthentication):
    """ Session authentication for CSRF protection """

    def authenticate(self, request):
        """ Enforce CSRF protection for unauthenticated users """
        # Get the session-based user from the underlying HttpRequest object
        user = getattr(request._request, 'user', None)
        # Set the csrftoken cookie reading the value from the header
        if request.headers.get('X-Csrftoken'):
            request.COOKIES[settings.CSRF_COOKIE_NAME] = request.headers.get('X-Csrftoken')
        # Enforce CSRF
        self.enforce_csrf(request)
        # CSRF passed with authenticated user
        return user, None
