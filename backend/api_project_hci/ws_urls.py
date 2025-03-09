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
)

websocket_urlpatterns = [
    path('api/project/ws/specialties/', SpecialtyConsumer.as_asgi(), name='ws_specialties'),
    path('api/project/ws/departments/', DepartmentConsumer.as_asgi(), name='ws_departments'),
    path('api/project/ws/rooms/', RoomConsumer.as_asgi(), name='ws_rooms'),
    path('api/project/ws/disabilities/', DisabilityConsumer.as_asgi(), name='ws_disabilities'),
    path('api/project/ws/patients/', PatientConsumer.as_asgi(), name='ws_patients'),
    path('api/project/ws/medical-staffs/', MedicalStaffConsumer.as_asgi(), name='ws_medical_staffs'),
    path('api/project/ws/admissions/', AdmissionConsumer.as_asgi(), name='ws_admissions'),
]
