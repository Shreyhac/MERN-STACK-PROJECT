from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import UserProfileSerializer, UserSourceUpdateSerializer

User = get_user_model()


@api_view(["GET"])
def get_user(request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


@api_view(["PATCH"])
def update_user_source(request):
    """Update the source for the current user."""
    serializer = UserSourceUpdateSerializer(data=request.data)

    if serializer.is_valid():
        # Update the user's source
        serializer.update(request.user, serializer.validated_data)

        # Return updated user profile
        user_serializer = UserProfileSerializer(request.user)
        return Response(user_serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
