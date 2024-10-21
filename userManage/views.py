from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer, ProfileSerializer
import os
from django.conf import settings
from django.http import FileResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from webServer.models import room_table

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
    

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    if(request.GET.get('username')):
        user = get_object_or_404(User ,username=request.GET.get('username'))
    else:
        user = get_object_or_404(User ,username=request.user)
    userSerializer = UserSerializer(user)
    profileSerializer = ProfileSerializer(user.profile)
    return Response({
        'user': userSerializer.data,
        'profile': profileSerializer.data
    })


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    friend_username = request.data.get('friend_username')
    friend = get_object_or_404(User, username=friend_username)
    user = request.user
    user.social.friendRequest.add(friend)
    user.social.save()
    friend.social.friendRequestSent.add(user)
    friend.social.save()
    return Response("Friend request sent successfully!", status=200)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def accept_friend_request(request):
    friend_username = request.data.get('friend_username')
    friend = get_object_or_404(User, username=friend_username)
    user = request.user
    if friend not in user.social.friendRequest.all():
        return Response("Friend request not found!", status=404)
    user.social.friendRequestSent.remove(friend)
    user.social.friendList.add(friend)
    user.social.save()
    friend.social.friendRequest.remove(user)
    friend.social.friendList.add(user)
    friend.social.save()
    if(user.id > friend.id):
        room_id = f'{user.id}_{friend.id}'
        room_key = f'{user.social.secret_key}_{friend.social.secret_key}'
    else:
        room_id = f'{friend.id}_{user.id}'
        room_key = f'{friend.social.secret_key}_{user.social.secret_key}'
    room_table(room_id=room_id, secret_key=room_key).save()
    return Response("Friend request accepted successfully!", status=200)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def decline_friend_request(request):
    friend_username = request.data.get('friend_username')
    friend = get_object_or_404(User, username=friend_username)
    user = request.user
    user.social.friendRequestSent.remove(friend)
    user.social.save()
    friend.social.friendRequest.remove(user)
    friend.social.save()
    return Response("Friend request declined successfully!", status=200)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def remove_friend(request):
    friend_username = request.data.get('friend_username')
    friend = get_object_or_404(User, username=friend_username)
    user = request.user
    user.social.friendList.remove(friend)
    user.social.save()
    friend.social.friendList.remove(user)
    friend.social.save()
    return Response("Friend removed successfully!", status=200)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_friends(request):
    user = request.user
    friends = user.social.friendList.all()
    friends_list = []
    for friend in friends:
        friends_list.append
        ({
            'username': friend.username,
            'first_name': friend.first_name,
            'last_name': friend.last_name,
            'email': friend.email,
            'phone_number': friend.profile.phone_number,
            'bio': friend.profile.bio,
            'profile_picture': friend.profile.profile_picture.url
        })
    return Response(friends_list)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_friend_requests(request):
    user = request.user
    friend_requests = user.social.friendRequest.all()
    friend_requests_list = []
    for friend in friend_requests:
        friend_requests_list.append
        ({
            'username': friend.username,
            'first_name': friend.first_name,
            'last_name': friend.last_name,
            'email': friend.email,
            'phone_number': friend.profile.phone_number,
            'bio': friend.profile.bio,
            'profile_picture': friend.profile.profile_picture.url
        })
    return Response(friend_requests_list)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_sent_friend_requests(request):
    user = request.user
    friend_requests = user.social.friendRequestSent.all()
    friend_requests_list = []
    for friend in friend_requests:
        friend_requests_list.append
        ({
            'username': friend.username,
            'first_name': friend.first_name,
            'last_name': friend.last_name,
            'email': friend.email,
            'phone_number': friend.profile.phone_number,
            'bio': friend.profile.bio,
            'profile_picture': friend.profile.profile_picture.url
        })
    return Response(friend_requests_list)