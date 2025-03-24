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
    path('delete/<str:model_name>/', views.delete_models, name='delete_models'),
    # PACIENTS
    path('create-patient/', views.create_patient, name='create_patient'),
    path('update-patient/<str:id>/', views.update_patient, name='update_patient'),
    path('delete-patient/<str:id>/', views.delete_patient, name='delete_patient'),
    path('delete-patient/', views.delete_patients, name='delete_patients'),
    # MEDICAL STAFFS
    path('create-medical-staff/', views.create_medical_staff, name='create_medical_staff'),
    path('update-medical-staff/<str:id>/', views.update_medical_staff, name='update_medical_staff'),
    path('delete-medical-staff/<str:id>/', views.delete_medical_staff, name='delete_medical_staff'),
    path('delete-medical-staff/', views.delete_medical_staffs, name='delete_medical_staffs'),
    # ADMISSIONS
    path('create-admission/', views.create_admission, name='create_admission'),
    path('update-admission/<str:id>/', views.update_admission, name='update_admission'),
    path('delete-admission/<str:id>/', views.delete_admission, name='delete_admission'),
    path('delete-admission/', views.delete_admissions, name='delete_admissions'),
    # EXTRAS
    path('delete/old-notifications/', views.remove_old_notifications, name='remove_old_notifications'),
    path('mark-read/notifications/', views.mark_as_read_notifications, name='mark_as_read_notifications'),
    path('delete-notifications/', views.delete_notifications, name='delete_notifications'),
    path('download/backup/', views.download_mongo_db, name='download_mongo_db'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
