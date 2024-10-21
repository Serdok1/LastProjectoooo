from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile, Social
from django.db.models.signals import pre_delete
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_save, sender=User)
def create_user_social(sender, instance, created, **kwargs):
    if created:
        Social.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_social(sender, instance, **kwargs):
    instance.social.save()


# Blacklist the user's tokens when the user is deleted
""" @receiver(pre_delete, sender=User)
def blacklist_user_tokens(sender, instance, **kwargs):
    tokens = OutstandingToken.objects.filter(user=instance)
    for token in tokens:
        BlacklistedToken.objects.get_or_create(token=token) """