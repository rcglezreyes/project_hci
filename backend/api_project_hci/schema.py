# myapp/schema.py
import graphene
from graphene_mongo import MongoengineObjectType
from mongoengine.fields import DynamicField
from graphene_mongo.converter import convert_mongoengine_field
from graphene.types.generic import GenericScalar
from .models import (
    Patient,
    MedicalStaff,
    Admission,
    Specialty,
    Department,
    Room,
    Disability,
    Diagnosis,
    Notification,
    NotificationUser,
    Tracking,
)
from api_authorization.models import LoginUser
from .data_util import serialize_datetime, dynamic_field_to_json
from bson import ObjectId

@convert_mongoengine_field.register(DynamicField)
def convert_dynamic_field(field, registry=None, executor=None):
    return graphene.JSONString(
        description=getattr(field, 'help_text', ''),
        required=field.required
    )
        
class SpecialtyType(MongoengineObjectType):
    class Meta:
        model = Specialty
        
class DepartmentType(MongoengineObjectType):
    class Meta:
        model = Department
        
class RoomType(MongoengineObjectType):
    class Meta:
        model = Room
        
class DisabilityType(MongoengineObjectType):
    class Meta:
        model = Disability


class DiagnosisType(MongoengineObjectType):
    class Meta:
        model = Diagnosis
        

class PatientType(MongoengineObjectType):
    class Meta:
        model = Patient
        
    user = GenericScalar()
    disabilities = GenericScalar()
    
    def resolve_user(self, info):
        user = self.user or {}
        user = serialize_datetime(user)
        return dynamic_field_to_json(user)
    
    def resolve_disabilities(self, info):
        disabilities = self.disabilities or []
        disabilities = serialize_datetime(disabilities)
        return dynamic_field_to_json(disabilities)
    
class MedicalStaffType(MongoengineObjectType):
    class Meta:
        model = MedicalStaff

    user = GenericScalar()
    specialty = GenericScalar()
    department = GenericScalar()

    def resolve_user(self, info):
        user = self.user or {}
        user = serialize_datetime(user)
        return dynamic_field_to_json(user)
    
    def resolve_specialty(self, info):
        specialty = self.specialty or []
        specialty = serialize_datetime(specialty)
        return dynamic_field_to_json(specialty)

    def resolve_department(self, info):
        department = self.department or []
        department = serialize_datetime(department)
        return dynamic_field_to_json(department)


class AdmissionType(MongoengineObjectType):
    class Meta:
        model = Admission
    
    patient = GenericScalar()
    medical_staff = GenericScalar()
    diagnoses = GenericScalar()
    room = GenericScalar()
    
    def resolve_patient(self, info):
        patient = self.patient or {}
        patient = serialize_datetime(patient)
        return dynamic_field_to_json(patient)
    
    def resolve_medical_staff(self, info):
        medical_staff = self.medical_staff or {}
        medical_staff = serialize_datetime(medical_staff)
        return dynamic_field_to_json(medical_staff)

    def resolve_diagnoses(self, info):
        diagnoses = self.diagnoses or []
        diagnoses = serialize_datetime(diagnoses)
        return dynamic_field_to_json(diagnoses)

    def resolve_room(self, info):
        room = self.room or {}
        room = serialize_datetime(room)
        return dynamic_field_to_json(room)


class NotificationType(MongoengineObjectType):
    class Meta:
        model = Notification

class NotificationUserType(MongoengineObjectType):
    class Meta:
        model = NotificationUser

    notification = GenericScalar()
    user = GenericScalar()

    def resolve_notification(self, info):
        notification = self.notification or {}
        notification = serialize_datetime(notification)
        return dynamic_field_to_json(notification)

    def resolve_user(self, info):
        user = self.user or {}
        user = serialize_datetime(user)
        return dynamic_field_to_json(user)


class NotificationUsersPaginated(graphene.ObjectType):
    count = graphene.Int()
    page = graphene.Int()
    page_size = graphene.Int()
    results = graphene.List(NotificationUserType)

class TrackingType(MongoengineObjectType):
    class Meta:
        model = Tracking
    created_time = graphene.String()
    managed_data = GenericScalar()
    user_reporter = GenericScalar()

    def resolve_created_time(self, info):
        return self.created_time.strftime('%Y-%m-%d %H:%M:%S')

    def resolve_managed_data(self, info):
        managed_data = self.managed_data or {}
        managed_data = serialize_datetime(managed_data)
        return dynamic_field_to_json(managed_data)

    def resolve_user_reporter(self, info):
        user_reporter = self.user_reporter or {}
        user_reporter = serialize_datetime(user_reporter)
        return dynamic_field_to_json(user_reporter)

    

class Query(graphene.ObjectType):
    patients = graphene.List(PatientType)
    medical_staffs = graphene.List(MedicalStaffType)
    admissions = graphene.List(AdmissionType)
    specialties = graphene.List(SpecialtyType)
    departments = graphene.List(DepartmentType)
    rooms = graphene.List(RoomType)
    disabilities = graphene.List(DisabilityType)
    diagnoses = graphene.List(DiagnosisType)
    trackings = graphene.List(TrackingType)
    notification_users = graphene.Field(
        NotificationUsersPaginated,
        username=graphene.String(required=False),
        user=graphene.String(required=False),
        page=graphene.Int(required=False, default_value=1),
        pageSize=graphene.Int(required=False, default_value=100)
    )

    def resolve_patients(self, info):
        return Patient.objects.all()

    def resolve_medical_staffs(self, info):
        return MedicalStaff.objects.all()

    def resolve_admissions(self, info):
        return Admission.objects.all()

    def resolve_specialties(self, info):
        return Specialty.objects.all()

    def resolve_departments(self, info):
        return Department.objects.all()

    def resolve_rooms(self, info):
        return Room.objects.all()
    
    def resolve_disabilities(self, info):
        return Disability.objects.all()

    def resolve_diagnoses(self, info):
        return Diagnosis.objects.all()

    def resolve_trackings(self, info):
        return Tracking.objects.all()

    def resolve_notification_users(self, info, username=None, user=None, page=1, pageSize=100):
        qs = NotificationUser.objects.all()
        if username:
            qs = qs(username=username)
        if user:
            qs = qs(user__username=user)
        qs = qs.order_by('-created_time')
        total = qs.count()
        skip = (page - 1) * pageSize
        paginated_qs = qs.skip(skip).limit(pageSize)
        return NotificationUsersPaginated(
            count=total,
            page=page,
            page_size=pageSize,
            results=list(paginated_qs)
        )
    

schema = graphene.Schema(query=Query)
