# project/urls.py
from django.urls import path  
from django.conf.urls.static import static
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from .schema import schema
from . import views
urlpatterns = [
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
    # SPECIALTY, DEPARTMENT, DISABILITY, ROOM
    path('create/<str:model_name>/', views.create_model, name='create_model'),
    path('update/<str:model_name>/<str:id>/', views.update_model, name='update_model'),
    path('delete/<str:model_name>/<str:id>/', views.delete_model, name='delete_model'),
    # PACIENTS
    path('create-patient/', views.create_patient, name='create_patient'),
    path('update-patient/<str:id>/', views.update_patient, name='update_patient'),
    path('delete-patient/<str:id>/', views.delete_patient, name='delete_patient'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
