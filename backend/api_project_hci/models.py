from mongoengine import (
                            Document, 
                            StringField, 
                            BooleanField, 
                            DateTimeField, 
                            DateTimeField, 
                            BooleanField, 
                            StringField, 
                            DateTimeField, 
                            BooleanField, 
                            StringField, 
                            DateTimeField,
                            ListField,
                            DynamicField,
                            IntField,
                            FloatField,
                        )

from django.utils import timezone


class MedicalStaff(Document):
    user = DynamicField(required=False)
    specialty = DynamicField(required=False)
    department = DynamicField(required=False)
    graduated_date = DateTimeField(default=timezone.now, null=True)
    created_time = DateTimeField(default=timezone.now, null=True)
    last_modified_time = DateTimeField(default=timezone.now, null=True)
    is_active = BooleanField(default=True)
    
    meta = {
        'collection': 'medical_staff',
        'ordering': ['order'],
        'indexes': [
            'user', 'specialty', 'department', 'graduated_date', 'created_time', 'last_modified_time'
        ],
        'verbose_name': 'Medical Staff',
        'verbose_name_plural': 'Medical Staffs'
    }

    def __str__(self):
        return self.name
    

class Patient(Document):
    user = DynamicField(required=False)
    disabilities = DynamicField(required=False)
    created_time = DateTimeField(default=timezone.now, null=True)
    last_modified_time = DateTimeField(default=timezone.now, null=True)
    birth_date = DateTimeField(null=True)
    is_active = BooleanField(default=True)
    
    meta = {
        'collection': 'patient',
        'ordering': ['order'],
        'indexes': [
            'user', 'disabilities', 'birth_date'
        ],
        'verbose_name': 'Patient',
        'verbose_name_plural': 'Patients'
    }

    def __str__(self):
        return self.name
    


class Admission(Document):
    patient = DynamicField(required=False)
    medical_staff = DynamicField(required=False)
    date = DateTimeField(default=timezone.now, null=True)
    diagnoses = ListField(DynamicField(required=False))
    diagnoses_notes = StringField(required=False)
    room = DynamicField(required=False)
    bed = IntField(required=False)
    is_surgical = BooleanField(default=False)
    is_urgent = BooleanField(default=False)
    days_in_admission = IntField(required=False)
    created_time = DateTimeField(default=timezone.now, null=True)
    last_modified_time = DateTimeField(default=timezone.now, null=True)
    is_active = BooleanField(default=True)
    
    meta = {
        'collection': 'admission',
        'ordering': ['order'],
        'indexes': [
            'patient', 'medical_staff', 'date', 'diagnoses', 'diagnoses_notes', 'room', 'bed', 'is_surgical', 'is_urgent', 'days_in_admission'
        ],
        'verbose_name': 'Admission',
        'verbose_name_plural': 'Admissions'
    }

    def __str__(self):
        return f'{self.patient} - {self.medical_staff}'
   

class Specialty(Document):
    name = StringField(max_length=255, required=True)
    description = StringField(required=False)
    created_time = DateTimeField(default=timezone.now, null=True)
    last_modified_time = DateTimeField(default=timezone.now, null=True)
    is_active = BooleanField(default=True)
    
    meta = {
        'collection': 'specialty',
        'ordering': ['order'],
        'indexes': [
            'name', 'description', 'created_time', 'last_modified_time'
        ],
        'verbose_name': 'Specialty',
        'verbose_name_plural': 'Specialties'
    }

    def __str__(self):
        return self.name
    

class Department(Document):
    name = StringField(max_length=255, required=True)
    description = StringField(required=False)
    created_time = DateTimeField(default=timezone.now, null=True)
    last_modified_time = DateTimeField(default=timezone.now, null=True)
    is_active = BooleanField(default=True)
    
    meta = {
        'collection': 'department',
        'ordering': ['order'],
        'indexes': [
            'name', 'description', 'created_time', 'last_modified_time'
        ],
        'verbose_name': 'Department',
        'verbose_name_plural': 'Departments'
    }

    def __str__(self):
        return self.name
    

class Room(Document):
    name = StringField(max_length=255, required=True)
    description = StringField(required=False)
    created_time = DateTimeField(default=timezone.now, null=True)
    last_modified_time = DateTimeField(default=timezone.now, null=True)
    is_active = BooleanField(default=True)
    
    meta = {
        'collection': 'room',
        'ordering': ['order'],
        'indexes': [
            'name', 'description', 'created_time', 'last_modified_time'
        ],
        'verbose_name': 'Room',
        'verbose_name_plural': 'Rooms'
    }

    def __str__(self):
        return self.name
    
    
class Disability(Document):
    name = StringField(max_length=255, required=True)
    description = StringField(required=False)
    created_time = DateTimeField(default=timezone.now, null=True)
    last_modified_time = DateTimeField(default=timezone.now, null=True)
    is_active = BooleanField(default=True)
    
    meta = {
        'collection': 'disability',
        'ordering': ['order'],
        'indexes': [
            'name', 'description', 'created_time', 'last_modified_time'
        ],
        'verbose_name': 'Disability',
        'verbose_name_plural': 'Disabilities'
    }

    def __str__(self):
        return self.name
    
    
class Tracking(Document):
    user_reporter = DynamicField(required=True)
    action = StringField(max_length=255, required=True)
    created_time = DateTimeField(default=timezone.now, null=True)
    managed_data = DynamicField(null=True)
    
    meta = {
        'collection': 'tracking',
        'indexes': [
            'user_reporter', 'action', 'created_time'
        ],
        'verbose_name': 'Tracking',
        'verbose_name_plural': 'Trackings'
    }
    
    def __str__(self):
        return self.action
    
class Notification(Document):
    module = StringField(max_length=255, null=True)
    info = StringField(max_length=255, null=True)
    info_id = StringField(max_length=255, null=True)
    created_time = DateTimeField(default=timezone.now, null=True)
    last_modified_time = DateTimeField(default=timezone.now, null=True)
    type = StringField(max_length=255, null=True, default='load')
    meta = {
        'collection': 'notification',
        'indexes': [
            'module', 'info', 'created_time', 'last_modified_time', 'type', 'info_id'
        ],
        'verbose_name': 'Notification',
        'verbose_name_plural': 'Notifications'
    }
    def __str__(self):
        return self.info
    
class NotificationUser(Document):
    notification = DynamicField(required=True)
    username = StringField(max_length=255, required=True)
    user = DynamicField(required=True)
    read = BooleanField(default=False)
    created_time = DateTimeField(default=timezone.now, null=True)
    last_modified_time = DateTimeField(default=timezone.now, null=True)
    meta = {
        'collection': 'notification_user',
        'indexes': [
            'notification', 'username', 'user', 'read', 'created_time', 'last_modified_time'
        ],
        'verbose_name': 'Notification User',
        'verbose_name_plural': 'Notification Users'
    }
    def __str__(self):
        return f'{self.username} - {self.notification.info}'


class Diagnosis(Document):
    name = StringField(max_length=255, required=True)
    description = StringField(required=False)
    created_time = DateTimeField(default=timezone.now, null=True)
    last_modified_time = DateTimeField(default=timezone.now, null=True)
    is_active = BooleanField(default=True)

    meta = {
        'collection': 'diagnosis',
        'ordering': ['order'],
        'indexes': [
            'name', 'description', 'created_time', 'last_modified_time'
        ],
        'verbose_name': 'Diagnosis',
        'verbose_name_plural': 'Diagnoses'
    }