from django.contrib.auth import logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def auth_logout(request):
    # Logout the user
    logout(request)

    return Response(
        {"message": "Successfully logged out"}, status=status.HTTP_200_OK
    )

