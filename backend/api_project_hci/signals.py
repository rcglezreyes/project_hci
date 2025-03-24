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
    Diagnosis,
    NotificationUser,
    Tracking,
)
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json

##########################################################################
# Tracking
##########################################################################

def tracking_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'tracking_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "userReporter": document.user_reporter,
                "action": document.action,
                "createdTime": document.created_time,
                "managedData": document.managed_data,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('tracking', serialize_datetime(event))


def tracking_deleted(sender, document, **kwargs):
    channel_layer = get_channel_layer()
    event = {
        'type': 'tracking_update',
        'message': {
            'type': 'deleted',
            "item": {
                "id": str(document.id),
                "userReporter": document.user_reporter,
                "action": document.action,
                "createdTime": document.created_time,
                "managedData": document.managed_data,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('tracking', serialize_datetime(event))

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
                "isActive": document.is_active,
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
                "isActive": document.is_active,
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
                "isActive": document.is_active,
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
                "isActive": document.is_active,
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
                "isActive": document.is_active,
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
                "isActive": document.is_active,
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
                "isActive": document.is_active,
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
                "isActive": document.is_active,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('disability', serialize_datetime(event))


##########################################################################
# Diagnosis
##########################################################################

def diagnosis_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'diagnosis_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
                "isActive": document.is_active,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('diagnosis', serialize_datetime(event))

def diagnosis_deleted(sender, document, **kwargs):
    channel_layer = get_channel_layer()
    event = {
        'type': 'diagnosis_update',
        'message': {
            'type': 'deleted',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
                "isActive": document.is_active,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('diagnosis', serialize_datetime(event))
    
    
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
                "user": document.user,
                "disabilities": document.disabilities,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
                "isActive": document.is_active,
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
                "user": document.user,
                "disabilities": document.disabilities,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
                "isActive": document.is_active,
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


# patient = DynamicField(required=False)
# medical_staff = DynamicField(required=False)
# date = DateTimeField(default=timezone.now, null=True)
# diagnoses = ListField(DynamicField(required=False))
# diagnoses_notes = StringField(required=False)
# room = DynamicField(required=False)
# bed = IntField(required=False)
# is_surgical = BooleanField(default=False)
# is_urgent = BooleanField(default=False)
# days_in_admission = IntField(required=False)
# created_time = DateTimeField(default=timezone.now, null=True)
# last_modified_time = DateTimeField(default=timezone.now, null=True)
# is_active = BooleanField(default=True)
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
                "patient": document.patient,
                "medicalStaff": document.medical_staff,
                "date": document.date,
                "diagnoses": document.diagnoses,
                "diagnosesNotes": document.diagnoses_notes,
                "room": document.room,
                "bed": document.bed,
                "isSurgical": document.is_surgical,
                "isUrgent": document.is_urgent,
                "daysInAdmission": document.days_in_admission,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
                "isActive": document.is_active,
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
                "patient": document.patient,
                "medicalStaff": document.medical_staff,
                "date": document.date,
                "diagnoses": document.diagnoses,
                "diagnosesNotes": document.diagnoses_notes,
                "room": document.room,
                "bed": document.bed,
                "isSurgical": document.is_surgical,
                "isUrgent": document.is_urgent,
                "daysInAdmission": document.days_in_admission,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
                "isActive": document.is_active,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('admission', serialize_datetime(event))


##########################################################################
# Notification User
##########################################################################

def notification_user_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'notification_user_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "notification": document.notification,
                "username": document.username,
                "user": document.user,
                "read": document.read,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('notification_user', serialize_datetime(event))


def notification_user_deleted(sender, document, **kwargs):
    channel_layer = get_channel_layer()
    event = {
        'type': 'notification_user_update',
        'message': {
            'type': 'deleted',
            "item": {
                "id": str(document.id),
                "notification": document.notification,
                "username": document.username,
                "user": document.user,
                "read": document.read,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
            }
        }
    }
    async_to_sync(channel_layer.group_send)('notification_user', serialize_datetime(event))
    
    
signals.post_save.connect(disability_saved, sender=Disability)
signals.post_delete.connect(disability_deleted, sender=Disability)

signals.post_save.connect(diagnosis_saved, sender=Diagnosis)
signals.post_delete.connect(diagnosis_saved, sender=Diagnosis)

signals.post_save.connect(patient_saved, sender=Patient)
signals.post_delete.connect(patient_deleted, sender=Patient)

signals.post_save.connect(medical_staff_saved, sender=MedicalStaff)
signals.post_delete.connect(medical_staff_deleted, sender=MedicalStaff)

signals.post_save.connect(admission_saved, sender=Admission)
signals.post_delete.connect(admission_deleted, sender=Admission)

signals.post_save.connect(specialty_saved, sender=Specialty)
signals.post_delete.connect(specialty_deleted, sender=Specialty)

signals.post_save.connect(department_saved, sender=Department)
signals.post_delete.connect(department_deleted, sender=Department)

signals.post_save.connect(room_saved, sender=Room)
signals.post_delete.connect(room_deleted, sender=Room)

signals.post_save.connect(room_saved, sender=Room)
signals.post_delete.connect(room_deleted, sender=Room)

signals.post_save.connect(notification_user_saved, sender=NotificationUser)
signals.post_delete.connect(notification_user_deleted, sender=NotificationUser)
