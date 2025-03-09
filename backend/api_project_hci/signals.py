from mongoengine import signals
from .data_util import serialize_datetime
from .models import (
    Patient,
    MedicalStaff,
    Admission,
    Specialty,
    Department,
    Room,
    Disability,
)
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json

##########################################################################
# Specialty
##########################################################################

def specialty_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'specialty_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('specialty', serialize_datetime(event))
    

def specialty_deleted(sender, document, **kwargs):
    channel_layer = get_channel_layer()
    event = {
        'type': 'specialty_update',
        'message': {
            'type': 'deleted',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('specialty', serialize_datetime(event))
    
    
##########################################################################
# Department
##########################################################################

def department_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'department_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('department', serialize_datetime(event))
    

def department_deleted(sender, document, **kwargs):
    channel_layer = get_channel_layer()
    event = {
        'type': 'department_update',
        'message': {
            'type': 'deleted',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('department', serialize_datetime(event))
    
    
##########################################################################
# Room
##########################################################################
def room_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'room_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('room', serialize_datetime(event))
    
def room_deleted(sender, document, **kwargs):
    channel_layer = get_channel_layer()
    event = {
        'type': 'room_update',
        'message': {
            'type': 'deleted',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('room', serialize_datetime(event))
    

##########################################################################
# Disability
##########################################################################

def disability_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'disability_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('disability', serialize_datetime(event))
    
def disability_deleted(sender, document, **kwargs):
    channel_layer = get_channel_layer()
    event = {
        'type': 'disability_update',
        'message': {
            'type': 'deleted',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('disability', serialize_datetime(event))
    
    
##########################################################################
# Patient
##########################################################################

def patient_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'patient_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "user": document.user,
                "disability": document.disability,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('patient', serialize_datetime(event))
    
def patient_deleted(sender, document, **kwargs):
    channel_layer = get_channel_layer()
    event = {
        'type': 'patient_update',
        'message': {
            'type': 'deleted',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "user": document.user,
                "disability": document.disability,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('patient', serialize_datetime(event))
    
    
##########################################################################
# Medical Staff
##########################################################################

def medical_staff_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'medical_staff_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "user": document.user,
                "specialty": document.specialty,
                "department": document.department,
                "graduatedDate": document.graduated_date,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('medical_staff', serialize_datetime(event))
    
def medical_staff_deleted(sender, document, **kwargs):
    channel_layer = get_channel_layer()
    event = {
        'type': 'medical_staff_update',
        'message': {
            'type': 'deleted',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "user": document.user,
                "specialty": document.specialty,
                "department": document.department,
                "graduatedDate": document.graduated_date,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('medical_staff', serialize_datetime(event))
    
    
##########################################################################
# Admission
##########################################################################

def admission_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'admission_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "user": document.user,
                "specialty": document.specialty,
                "department": document.department,
                "graduatedDate": document.graduated_date,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('admission', serialize_datetime(event))
    
def admission_deleted(sender, document, **kwargs):
    channel_layer = get_channel_layer()
    event = {
        'type': 'admission_update',
        'message': {
            'type': 'deleted',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "user": document.user,
                "specialty": document.specialty,
                "department": document.department,
                "graduatedDate": document.graduated_date,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('admission', serialize_datetime(event))
    
    
signals.post_save.connect(disability_saved, sender=Disability)
signals.post_save.connect(disability_deleted, sender=Disability)

signals.post_save.connect(patient_saved, sender=Patient)
signals.post_save.connect(patient_deleted, sender=Patient)

signals.post_save.connect(medical_staff_saved, sender=MedicalStaff)
signals.post_save.connect(medical_staff_deleted, sender=MedicalStaff)

signals.post_save.connect(admission_saved, sender=Admission)
signals.post_save.connect(admission_deleted, sender=Admission)

signals.post_save.connect(specialty_saved, sender=Specialty)
signals.post_save.connect(specialty_deleted, sender=Specialty)

signals.post_save.connect(department_saved, sender=Department)
signals.post_save.connect(department_deleted, sender=Department)

signals.post_save.connect(room_saved, sender=Room)
signals.post_save.connect(room_deleted, sender=Room)
