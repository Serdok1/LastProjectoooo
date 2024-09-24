from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer, ProfileSerializer
import os
from django.conf import settings
from django.http import FileResponse

# Create your views here.

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    userSerializer = UserSerializer(user)
    profileSerializer = ProfileSerializer(user.profile)
    return Response({
        'user': userSerializer.data,
        'profile': profileSerializer.data
    })

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_user_info(request):
    new_email = request.data.get('email')
    new_phone = request.data.get('phone_number')
    new_bio = request.data.get('bio')

    # Get the user object based on the authenticated user
    user = request.user

    # Update email if provided
    if new_email:
        user.email = new_email
        user.save()  # Save the user object to update the email

    # Update profile fields if provided
    profile = user.profile  # Assuming user has a related profile
    if new_phone:
        profile.phone_number = new_phone
    if new_bio:
        profile.bio = new_bio

    # Save the profile after updating it
    profile.save()

    return Response("User info updated successfully!", status=200)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_profile_picture(request):
    new_pp = request.FILES.get('profile_picture')

    if new_pp:
        user = request.user
        # Save the new profile picture to the user's profile
        user.profile.profile_picture.save(f"{user.username}_profile_picture.jpg", new_pp)
        user.profile.save()

        # You can return the URL of the saved profile picture if needed
        profile_picture_url = user.profile.profile_picture.url

        return Response({
            "message": "Profile picture updated successfully!",
            "profile_picture_url": profile_picture_url
        }, status=200)
    else:
        return Response({"error": "No file uploaded."}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_default_pp(request):
    # Path to the default profile picture
    default_pp_path = os.path.join(settings.MEDIA_ROOT, 'default_pictures/default_picture.png')
    
    # Open the image file in binary mode and return it as a response
    try:
        return FileResponse(open(default_pp_path, 'rb'), content_type='image/png')
    except FileNotFoundError:
        return Response({"error": "Default profile picture not found"}, status=404)