from django.urls import path
from .views import user_info,update_user_info, update_profile_picture, get_default_pp

urlpatterns = [
    path('user_info/', user_info, name='user_info'),
    path('update_user_info/', update_user_info, name='update_user_info'),
    path('update_profile_picture/', update_profile_picture, name='update_profile_picture'),
    path('get_default_pp/', get_default_pp, name='get_default_pp'),
]