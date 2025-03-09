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
        

class PatientType(MongoengineObjectType):
    class Meta:
        model = Patient
        
    user = GenericScalar()
    disability = GenericScalar()
    
    def resolve_user(self, info):
        user = self.user or {}
        user = serialize_datetime(user)
        return dynamic_field_to_json(user)
    
    def resolve_disability(self, info):
        disability = self.disability or []
        disability = serialize_datetime(disability)
        return dynamic_field_to_json(disability)
    
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
    diagnosis = GenericScalar()
    room = GenericScalar()
    
    def resolve_patient(self, info):
        patient = self.patient or {}
        patient = serialize_datetime(patient)
        return dynamic_field_to_json(patient)
    
    def resolve_medical_staff(self, info):
        medical_staff = self.medical_staff or {}
        medical_staff = serialize_datetime(medical_staff)
        return dynamic_field_to_json(medical_staff)

    def resolve_diagnosis(self, info):
        diagnosis = self.diagnosis or []
        diagnosis = serialize_datetime(diagnosis)
        return dynamic_field_to_json(diagnosis)

    def resolve_room(self, info):
        room = self.room or {}
        room = serialize_datetime(room)
        return dynamic_field_to_json(room)

    

class Query(graphene.ObjectType):
    patients = graphene.List(PatientType)
    medical_staffs = graphene.List(MedicalStaffType)
    admissions = graphene.List(AdmissionType)
    specialties = graphene.List(SpecialtyType)
    departments = graphene.List(DepartmentType)
    rooms = graphene.List(RoomType)
    disabilities = graphene.List(DisabilityType)

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
    

schema = graphene.Schema(query=Query)
