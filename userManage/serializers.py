from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User 
        fields = ['id', 'username', 'password', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Profile
        fields = ['bio', 'phone_number', 'two_factor_auth', 'two_factor_auth_secret', 'profile_picture']