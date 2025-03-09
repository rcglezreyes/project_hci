from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone
from .models import (
    Patient,
    MedicalStaff,
    Admission,
    Specialty,
    Department,
    Room,
    Disability,
    Tracking,
)
from .data_util import (
    transform_data_to_mongo,
    create_notification,
)
import json
import logging

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)
    

################################################
# CREATE SPECIALTY, DEPARTMENT, ROOM, DISABILITY
################################################

@api_view(['POST'])
@permission_classes([AllowAny])
def create_model(request, model_name):         
    data = request.data
    
    user_reporter = json.loads(data.get('userReporter', None))
    
    name = data.get('name', '')
    description = data.get('description', '')

    try:
        
        obj = None
        
        if model_name == 'specialty':
            obj = Specialty
        elif model_name == 'department':
            obj = Department
        elif model_name == 'room':
            obj = Room
        elif model_name == 'disability':
            obj = Disability
        
        if not obj:
            return Response({'error': 'Model not found'}, status=404)
        
        item = obj.objects(name=name).first()
        
        if item:
            return Response({'error': f'{model_name.capitalize()} with this name {name} already exists'}, status=404)
        
        item = obj(
            name=name,
            description=description,
            created_time=timezone.now(),
            last_modified_time=timezone.now(),
        )
        item.save()
        
        logger.info(f'Created {model_name} with id {item.id} and name {item.name}')
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'create {model_name} ({item.id} - {item.name})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(item)
            },
        )
        
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module=model_name
            info=f'has created new {model_name} {item.name}'
            info_id=item.id
            type=f'create_{model_name}'
            create_notification(module, info_id, info, type, user_reporter['username'])
        
        return Response({
            'message': 'Item created successfully',
            'data': json.loads(item.to_json())
        }, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

    
################################################
# UPDATE SPECIALTY, DEPARTMENT, ROOM, DISABILITY
################################################

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_model(request, model_name, id):
    data = request.data
    
    user_reporter = json.loads(data.get('userReporter', None))
    
    name = data.get('name', '')
    description = data.get('description', '')
    
    try:
        
        obj = None
        
        if model_name == 'specialty':
            obj = Specialty
        elif model_name == 'department':
            obj = Department
        elif model_name == 'room':
            obj = Room
        elif model_name == 'disability':
            obj = Disability
        
        if not obj:
            return Response({'error': 'Model not found'}, status=404)
        
        item = obj.objects(name=name).first()
        
        if item and str(item.id) != str(id):
            return Response({'error': f'{model_name.capitalize()} with this name {name} already exists'}, status=404)
        
        item = obj.objects(id=id).first()
        
        if not item:
            return Response({'error': f'{model_name.capitalize()} with this id {id} does not exist'}, status=404)
        
        item.name = name
        item.description = description
        item.last_modified_time = timezone.now()
        item.save()
        
        logger.info(f'Updated {model_name} with id {item.id} and name {item.name}')
        
        if model_name == 'specialty' or model_name == 'department':
            medical_staffs = MedicalStaff.objects(specialty__id=id).all()
            for medical_staff in medical_staffs:
                if model_name == 'specialty':
                    medical_staff.specialty = transform_data_to_mongo(item)
                else:
                    medical_staff.department = transform_data_to_mongo(item)
                medical_staff.save()
                
                admissions = Admission.objects(medical_staff__id=medical_staff.id).all()
                for admission in admissions:
                    admission.medical_staff = transform_data_to_mongo(medical_staff)
                    admission.save()
                    
        elif model_name == 'room':
            admissions = Admission.objects(room__id=id).all()
            for admission in admissions:
                admission.room = transform_data_to_mongo(item)
                admission.save()
        
        else:
            patients = Patient.objects(disability__id=id).all()
            for patient in patients:
                patient.disability = transform_data_to_mongo(item)
                patient.save()
                
                admissions = Admission.objects(patient__id=patient.id).all()
                for admission in admissions:
                    admission.patient = transform_data_to_mongo(patient)
                    admission.save()
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'update {model_name} ({item.id} - {item.name})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(item)
            },
        )
        
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module=model_name
            info=f'has updated {model_name} {item.name}'
            info_id=item.id
            type=f'update_{model_name}'
            create_notification(module, info_id, info, type, user_reporter['username'])
        
        return Response({
            'message': 'Item updated successfully',
            'data': json.loads(item.to_json())
        }, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    
################################################
# DELETE SPECIALTY, DEPARTMENT, ROOM, DISABILITY
################################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_model(request, model_name, id):
    data = request.data
    
    user_reporter = json.loads(data.get('userReporter', None))
    
    try:
        
        obj = None
        
        if model_name == 'specialty':
            obj = Specialty
        elif model_name == 'department':
            obj = Department
        elif model_name == 'room':
            obj = Room
        elif model_name == 'disability':
            obj = Disability
        
        if not obj:
            return Response({'error': 'Model not found'}, status=404)
        
        item = obj.objects(id=id).first()
        
        if not item:
            return Response({'error': f'{model_name.capitalize()} with this id {id} does not exist'}, status=404)
        
        item.delete()
        
        logger.info(f'Deleted {model_name} with id {item.id} and name {item.name}')
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete {model_name} ({item.id} - {item.name})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(item)
            },
        )
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module=model_name
            info=f'has deleted {model_name} {item.name}'
            info_id=item.id
            type=f'delete_{model_name}'
            create_notification(module, info_id, info, type, user_reporter['username'])
        
        return Response({
            'message': 'Item deleted successfully',
            'data': json.loads(item.to_json())
        }, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    
################################################
# CREATE PATIENT
################################################

@api_view(['POST'])
@permission_classes([AllowAny])
def create_patient(request):
    data = request.data
    
    user_reporter = json.loads(data.get('userReporter', None))
    
    user = json.loads(data.get('user', None))
    
    disability = json.loads(data.get('disability', None))
    
    try:
        
        patient = Patient.objects(user__id=user['id']).first()
    
        if patient:
            return Response({'error': 'Patient already exists'}, status=404)
        
        patient = Patient(
            user=user,
            disability=disability,
            created_time=timezone.now(),
            last_modified_time=timezone.now(),
        )
        
        patient.save()
        
        logger.info(f'Created patient with id {patient.id} and username {patient.user["username"]}')
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'create patient ({patient.id} - {patient.user["username"]})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(patient)
            },
        )
        
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module='patient'
            info=f'has created new patient {patient.user["username"]}'
            info_id=patient.id
            type='create_patient'
            create_notification(module, info_id, info, type, user_reporter['username'])
        
        return Response({
            'message': 'Patient created successfully',
            'data': json.loads(patient.to_json())
        }, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    
#################################################
# UPDATE PATIENT
#################################################

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_patient(request, id):
    data = request.data
    
    user_reporter = json.loads(data.get('userReporter', None))
    
    user = json.loads(data.get('user', None))
    
    disability = json.loads(data.get('disability', None))
    
    try:
        
        patient = Patient.objects(user__id=user['id']).first()
    
        if not patient:
            return Response({'error': 'Patient does not exist'}, status=404)
        
        if str(patient.id) != str(id):
            return Response({'error': 'Patient id does not match'}, status=404)
        
        patient.user = user
        patient.disability = disability
        patient.last_modified_time = timezone.now()
        
        patient.save()
        
        logger.info(f'Updated patient with id {patient.id} and username {patient.user["username"]}')
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'update patient ({patient.id} - {patient.user["username"]})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(patient)
            },
        )
        
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module='patient'
            info=f'has updated patient {patient.user["username"]}'
            info_id=patient.id
            type='update_patient'
            create_notification(module, info_id, info, type, user_reporter['username'])
        
        return Response({
            'message': 'Patient updated successfully',
            'data': json.loads(patient.to_json())
        }, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)        
        
    
##################################################
# DELETE PATIENT
##################################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_patient(request, id):
    data = request.data
    
    user_reporter = json.loads(data.get('userReporter', None))
    
    try:
        
        patient = Patient.objects(id=id).first()
        
        if not patient:
            return Response({'error': 'Patient does not exist'}, status=404)
        
        patient.delete()
        
        logger.info(f'Deleted patient with id {patient.id} and username {patient.user["username"]}')
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete patient ({patient.id} - {patient.user["username"]})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(patient)
            },
        )
        tracking.save()
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module='patient'
            info=f'has deleted patient {patient.user["username"]}'
            info_id=patient.id
            type='delete_patient'
            create_notification(module, info_id, info, type, user_reporter['username'])
            
        return Response({
            'message': 'Patient deleted successfully',
            'data': json.loads(patient.to_json())
        }, status=200)
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    
    
        