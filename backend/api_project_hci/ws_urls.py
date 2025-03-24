# api_zoho/routing.py
from django.urls import path
from .consumers import (
    SpecialtyConsumer,
    DepartmentConsumer,
    RoomConsumer,
    DisabilityConsumer,
    PatientConsumer,
    MedicalStaffConsumer,
    AdmissionConsumer,
    DiagnosisConsumer,
    NotificationUserConsumer,
    TrackingConsumer,
)

websocket_urlpatterns = [
    path('api/main/ws/specialties/', SpecialtyConsumer.as_asgi(), name='ws_specialties'),
    path('api/main/ws/departments/', DepartmentConsumer.as_asgi(), name='ws_departments'),
    path('api/main/ws/rooms/', RoomConsumer.as_asgi(), name='ws_rooms'),
    path('api/main/ws/disabilities/', DisabilityConsumer.as_asgi(), name='ws_disabilities'),
    path('api/main/ws/patients/', PatientConsumer.as_asgi(), name='ws_patients'),
    path('api/main/ws/medical-staffs/', MedicalStaffConsumer.as_asgi(), name='ws_medical_staffs'),
    path('api/main/ws/admissions/', AdmissionConsumer.as_asgi(), name='ws_admissions'),
    path('api/main/ws/diagnoses/', DiagnosisConsumer.as_asgi(), name='ws_diagnoses'),
    path('api/main/ws/notifications/', NotificationUserConsumer.as_asgi(), name='ws_notifications'),
    path('api/main/ws/tracks/', TrackingConsumer.as_asgi(), name='ws_tracks'),
]
