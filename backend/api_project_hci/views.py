from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone
from django.conf import settings
from django.http import HttpResponse
from pymongo import MongoClient
from bson import json_util
from .models import (
    Patient,
    MedicalStaff,
    Admission,
    Specialty,
    Department,
    Room,
    Disability,
    Tracking,
    Diagnosis,
    Notification,
    NotificationUser,
)
from .data_util import (
    transform_data_to_mongo,
    create_notification,
)
import json
import logging
import zipfile
import io


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

        match model_name:
            case 'specialty':
                obj = Specialty
            case 'department':
                obj = Department
            case 'room':
                obj = Room
            case 'disability':
                obj = Disability
            case 'diagnosis':
                obj = Diagnosis
            case _:
                obj = None

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

        match model_name:
            case 'specialty':
                obj = Specialty
            case 'department':
                obj = Department
            case 'room':
                obj = Room
            case 'disability':
                obj = Disability
            case 'diagnosis':
                obj = Diagnosis
            case _:
                obj = None

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

        if model_name == 'specialty':
            new_specialty_data = transform_data_to_mongo(item)
            for ms in MedicalStaff.objects(specialty__id=id):
                ms.specialty = new_specialty_data
                ms.save()
                for admission in Admission.objects(medical_staff__id=str(ms.id)):
                    admission.medical_staff = transform_data_to_mongo(ms)
                    admission.save()

        elif model_name == 'department':
            new_department_data = transform_data_to_mongo(item)
            for ms in MedicalStaff.objects(department__id=id):
                ms.department = new_department_data
                ms.save()
                for admission in Admission.objects(medical_staff__id=str(ms.id)):
                    admission.medical_staff = transform_data_to_mongo(ms)
                    admission.save()

        elif model_name == 'room':
            new_room_data = transform_data_to_mongo(item)
            admissions = Admission.objects(room__id=id).all()
            for admission in admissions:
                admission.room = new_room_data
                admission.save()

        elif model_name == 'diagnosis':
            for admission in Admission.objects(diagnoses__id=id):
                updated = False
                for diag in admission.diagnoses:
                    if diag.get("id") == id:
                        diag["name"] = item.name
                        diag["description"] = item.description
                        updated = True
                if updated:
                    admission.save()

        elif model_name == 'disability':
            patients = Patient.objects(disabilities__id=id)
            patient_ids = {str(p.id) for p in patients}
            for patient in patients:
                disabilities = [d for d in patient.disabilities if d.get("id") != id]
                disabilities.append(transform_data_to_mongo(item))
                patient.disabilities = disabilities
                patient.save()

            for admission in Admission.objects():
                patient_data = admission.patient
                if patient_data and patient_data.get("id") in patient_ids:
                    if "disabilities" in patient_data:
                        updated_disabilities = [d for d in patient_data.get("disabilities") if d.get("id") != id]
                        updated_disabilities.append(transform_data_to_mongo(item))
                        patient_data["disabilities"] = updated_disabilities
                        admission.patient = patient_data
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

        match model_name:
            case 'specialty':
                obj = Specialty
            case 'department':
                obj = Department
            case 'room':
                obj = Room
            case 'disability':
                obj = Disability
            case 'diagnosis':
                obj = Diagnosis
            case _:
                obj = None

        if not obj:
            return Response({'error': 'Model not found'}, status=404)

        item = obj.objects(id=id).first()

        if not item:
            return Response({'error': f'{model_name.capitalize()} with this id {id} does not exist'}, status=404)

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete {model_name} ({item.id} - {item.name})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(item)
            },
        )

        item.delete()

        logger.info(f'Deleted {model_name} with id {item.id} and name {item.name}')

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module=model_name
            info=f'has deleted {model_name} {item.name}'
            info_id=item.id
            type=f'delete_{model_name}'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': f'{model_name.capitalize()} deleted successfully',
            'data': json.loads(item.to_json())
        }, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


################################################
# DELETE SPECIALTIES, DEPARTMENTS, ROOMS, DISABILITIES
################################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_models(request, model_name):
    data = request.data

    user_reporter = json.loads(data.get('userReporter', None))

    ids = data.get('ids', [])

    try:

        obj = None

        match model_name:
            case 'specialty':
                obj = Specialty
            case 'department':
                obj = Department
            case 'room':
                obj = Room
            case 'disability':
                obj = Disability
            case 'diagnosis':
                obj = Diagnosis
            case _:
                obj = None

        if not obj:
            return Response({'error': 'Model not found'}, status=404)

        items = obj.objects(id__in=ids).all()

        if not items:
            return Response({'error': f'{model_name.capitalize()} with this ids {','.join(ids)} do not exist'}, status=404)

        tracking_info = []
        for item in items:
            tracking_info.append(transform_data_to_mongo(item))

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete list {model_name}',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        items.delete()

        logger.info(f'Deleted {model_name} with ids {','.join(ids)} ')

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module=model_name
            info=f'has deleted list {model_name}'
            info_id='list'
            type=f'delete_list_{model_name}'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': f'{model_name.capitalize()} deleted successfully',
            'data': tracking_info
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

    user = data.get('user', {})

    disabilities = data.get('disabilities', [])

    birth_date = data.get('birthDate', None)

    try:

        patient = Patient.objects(user__id=user['id']).first()

        if patient:
            return Response({'error': 'Patient already exists'}, status=404)

        patient = Patient(
            user=user,
            disabilities=disabilities,
            birth_date=birth_date,
            created_time=timezone.now(),
            last_modified_time=timezone.now(),
        )

        patient.save()

        logger.info(f'Created patient with id {patient.id} and username {patient.user.get("username", None)}')

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'create patient ({patient.id} - {patient.user.get("username", None)})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(patient)
            },
        )

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module='patient'
            info=f'has created new patient {patient.user.get("username", None)}'
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

    disabilities = json.loads(data.get('disabilities', []))

    birth_date = data.get('birthDate', None)

    try:

        patient = Patient.objects(user__id=user['id']).first()

        if not patient:
            return Response({'error': 'Patient does not exist'}, status=404)

        if str(patient.id) != str(id):
            return Response({'error': 'Patient id does not match'}, status=404)

        patient.user = user
        patient.disabilities = disabilities
        patient.birth_date = birth_date
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

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete patient ({patient.id} - {patient.user["username"]})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(patient)
            },
        )
        patient.delete()

        logger.info(f'Deleted patient with id {patient.id} and username {patient.user["username"]}')

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


##################################################
# DELETE PATIENTS
##################################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_patients(request):
    data = request.data

    user_reporter = json.loads(data.get('userReporter', None))

    ids = data.get('ids', [])

    try:

        patients = Patient.objects(id__in=ids).all()

        if not patients:
            return Response({'error': 'Patients do not exist'}, status=404)

        tracking_info = [transform_data_to_mongo(patient) for patient in patients]

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete list patient ({','.join([patient.user.get("username", None) for patient in patients])})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        patients.delete()

        logger.info(f'Deleted patient with ids {','.join(ids)} and username {','.join([patient.user.get("username", None) for patient in patients])}')

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module='patient'
            info=f'has deleted list patient {','.join([patient.user.get("username", None) for patient in patients])}'
            info_id='list'
            type='delete_list_patient'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': 'Patients deleted successfully',
            'data': tracking_info
        }, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


################################################
# CREATE MEDICAL STAFF
################################################

@api_view(['POST'])
@permission_classes([AllowAny])
def create_medical_staff(request):
    data = request.data

    user_reporter = json.loads(data.get('userReporter', None))

    user = data.get('user', {})

    specialty = data.get('specialty', {})

    department = data.get('department', {})

    graduated_date = data.get('graduatedDate', None)

    try:

        medical = MedicalStaff.objects(user__id=user['id']).first()

        if medical:
            return Response({'error': 'Medical Staff already exists'}, status=404)

        medical = MedicalStaff(
            user=user,
            specialty=specialty,
            department=department,
            graduated_date=graduated_date,
            created_time=timezone.now(),
            last_modified_time=timezone.now(),
        )

        medical.save()

        logger.info(f'Created medical staff with id {medical.id} and username {medical.user.get("username", None)}')

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'create medical staff ({medical.id} - {medical.user.get("username", None)})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(medical)
            },
        )

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module='medical_staff'
            info=f'has created new medical staff {medical.user.get("username", None)}'
            info_id=medical.id
            type='create_medical_staff'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': 'Patient created successfully',
            'data': json.loads(medical.to_json())
        }, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


#################################################
# UPDATE MEDICAL STAFF
#################################################

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_medical_staff(request, id):
    data = request.data

    user_reporter = json.loads(data.get('userReporter', None))

    user = json.loads(data.get('user', None))

    specialty = json.loads(data.get('specialty', None))

    department = json.loads(data.get('department', None))

    graduated_date = data.get('graduatedDate', None)

    try:

        medical = MedicalStaff.objects(user__id=user['id']).first()

        if not medical:
            return Response({'error': 'Medical Staff does not exist'}, status=404)

        if str(medical.id) != str(id):
            return Response({'error': 'Medical Staff id does not match'}, status=404)

        medical.user = user
        medical.specialty = specialty
        medical.graduated_date = graduated_date
        medical.department = department
        medical.last_modified_time = timezone.now()

        medical.save()

        logger.info(f'Updated medical staff with id {medical.id} and username {medical.user["username"]}')

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'update medical staff ({medical.id} - {medical.user["username"]})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(medical)
            },
        )

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module='medical_staff'
            info=f'has updated medical staff {medical.user.get("username", None)}'
            info_id=medical.id
            type='update_medical_staff'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': 'Medical Staff updated successfully',
            'data': json.loads(medical.to_json())
        }, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


##################################################
# DELETE MEDICAL STAFF
##################################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_medical_staff(request, id):
    data = request.data

    user_reporter = json.loads(data.get('userReporter', None))

    try:

        medical = MedicalStaff.objects(id=id).first()

        if not medical:
            return Response({'error': 'Medical Staff does not exist'}, status=404)

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete medical staff ({medical.id} - {medical.user["username"]})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(medical)
            },
        )
        medical.delete()

        logger.info(f'Deleted medical staff with id {medical.id} and username {medical.user.get("username", None)}')

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module='medical_staff'
            info=f'has deleted medical staff {medical.user.get("username", None)}'
            info_id=medical.id
            type='delete_medical_staff'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': 'Medical Staff deleted successfully',
            'data': json.loads(medical.to_json())
        }, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


##################################################
# DELETE MEDICAL STAFFS
##################################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_medical_staffs(request):
    data = request.data

    user_reporter = json.loads(data.get('userReporter', None))

    ids = data.get('ids', [])

    try:

        medicals = MedicalStaff.objects(id__in=ids).all()

        if not medicals:
            return Response({'error': 'Medical Staffs do not exist'}, status=404)

        tracking_info = [transform_data_to_mongo(medical) for medical in medicals]

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete list medical staffs ({','.join([medical.user.get("username", None) for medical in medicals])})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        medicals.delete()

        logger.info(f'Deleted medical staffs with ids {','.join(ids)} and username {','.join([medical.user.get("username", None) for medical in medicals])}')

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module='medical_staff'
            info=f'has deleted list medical staffs {','.join([medical.user.get("username", None) for medical in medicals])}'
            info_id='list'
            type='delete_list_medical_staff'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': 'Medical Staffs deleted successfully',
            'data': tracking_info
        }, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


################################################
# CREATE ADMISSION
################################################

@api_view(['POST'])
@permission_classes([AllowAny])
def create_admission(request):
    data = request.data

    user_reporter = json.loads(data.get('userReporter', None))
    patient = data.get('patient', {})
    medical_staff = data.get('medicalStaff', {})
    diagnoses = data.get('diagnoses', [])
    diagnoses_notes = data.get('diagnosesNotes', None)
    date = data.get('date', None)
    room = data.get('room', {})
    bed = data.get('bed', None)
    is_surgical = data.get('isSurgical', False)
    is_urgent = data.get('isUrgent', False)
    days_in_admission = data.get('daysInAdmission', None)

    try:

        admission = Admission.objects(
            patient__id=patient.get('id', None), medical_staff__id=medical_staff.get('id', None), date=date,
        ).first()

        if admission:
            return Response({'error': 'Admission already exists'}, status=404)

        admission = Admission(
            patient=patient,
            medical_staff=medical_staff,
            diagnoses=diagnoses,
            diagnoses_notes=diagnoses_notes,
            date=date,
            room=room,
            bed=bed,
            is_surgical=is_surgical,
            is_urgent=is_urgent,
            days_in_admission=days_in_admission,
            created_time=timezone.now(),
            last_modified_time=timezone.now(),
        )

        admission.save()

        logger.info(f'Created admission with id {admission.id}, patient {patient}, medical staff {medical_staff}')

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'create admission ({admission.id})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(admission)
            },
        )

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module='admission'
            info=f'has created new admission {admission.id}'
            info_id=admission.id
            type='create_admission'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': 'Admission created successfully',
            'data': json.loads(admission.to_json())
        }, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


#################################################
# UPDATE ADMISSION
#################################################

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_admission(request, id):
    data = request.data

    user_reporter = json.loads(data.get('userReporter', None))
    patient = data.get('patient', {})
    medical_staff = data.get('medicalStaff', {})
    diagnoses = data.get('diagnoses', [])
    diagnoses_notes = data.get('diagnosesNotes', None)
    date = data.get('date', None)
    room = data.get('room', {})
    bed = data.get('bed', None)
    is_surgical = data.get('isSurgical', False)
    is_urgent = data.get('isUrgent', False)
    days_in_admission = data.get('daysInAdmission', None)

    try:

        admission = Admission.objects(id=id).first()

        if not admission:
            return Response({'error': 'Admission does not exist'}, status=404)

        admission.patient = patient
        admission.medical_staff = medical_staff
        admission.diagnoses = diagnoses
        admission.diagnoses_notes = diagnoses_notes
        admission.date = date
        admission.room = room
        admission.bed = bed
        admission.is_surgical = is_surgical
        admission.is_urgent = is_urgent
        admission.days_in_admission = days_in_admission

        admission.save()

        logger.info(f'Updated admission with id {admission.id}, patient {patient}, medical staff {medical_staff}')

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'update admission ({admission.id})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(admission)
            },
        )

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module='admission'
            info=f'has updated admission {admission.id}'
            info_id=admission.id
            type='update_admission'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': 'Admission updated successfully',
            'data': json.loads(admission.to_json())
        }, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


##################################################
# DELETE ADMISSION
##################################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_admission(request, id):
    data = request.data

    user_reporter = json.loads(data.get('userReporter', None))

    try:

        admission = Admission.objects(id=id).first()

        if not admission:
            return Response({'error': 'Admission does not exist'}, status=404)

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete admission ({admission.id}, patient {admission.patient}, medical staff {admission.medical_staff})',
            created_time=timezone.now(),
            managed_data={
                'data': transform_data_to_mongo(admission)
            },
        )
        admission.delete()

        logger.info(f'Deleted admission with id {admission.id}')

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module='admission'
            info=f'has deleted admission {admission.id}'
            info_id=admission.id
            type='delete_admission'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': 'Admission deleted successfully',
            'data': json.loads(admission.to_json())
        }, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


##################################################
# DELETE ADMISSIONS
##################################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_admissions(request):
    data = request.data

    user_reporter = json.loads(data.get('userReporter', None))

    ids = data.get('ids', [])

    try:

        admissions = Admission.objects(id__in=ids).all()

        if not admissions:
            return Response({'error': 'Admissions do not exist'}, status=404)

        tracking_info = [transform_data_to_mongo(admission) for admission in admissions]

        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete list admissions ({','.join([str(admission.id) for admission in admissions])})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        admissions.delete()

        logger.info(f'Deleted admissions with ids {','.join(ids)}')

        tracking.save()

        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        if user_reporter:
            module='admission'
            info=f'has deleted list admissions {','.join(ids)}'
            info_id='list'
            type='delete_list_admission'
            create_notification(module, info_id, info, type, user_reporter['username'])

        return Response({
            'message': 'Admissions deleted successfully',
            'data': tracking_info
        }, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


#############################################
# REMOVE ALL NOTIFICATIONS
#############################################


@api_view(['DELETE'])
@permission_classes([AllowAny])
def remove_old_notifications(request):
    now = timezone.now()
    days_ago = now - timezone.timedelta(days=7)
    NotificationUser.objects(updated_at__lt=days_ago).delete()
    Notification.objects(updated_at__lt=days_ago).delete()
    return Response({'message': '7 days old Notifications removed successfully'}, status=200)



#############################################
# DELETE NOTIFICATIONS
#############################################


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_notifications(request):
    data = request.data
    userReporter = json.loads(data.get('userReporter', None))
    if not userReporter:
        return Response({'error': 'User not found'}, status=404)
    notification_ids = data.get('notificationIds', [])
    notifications = NotificationUser.objects(id__in=notification_ids).all()
    tracking_info = [transform_data_to_mongo(notification) for notification in notifications]
    notifications.delete()

    tracking = Tracking(
        user_reporter=userReporter,
        action=f'delete notifications',
        created_time=timezone.now(),
        managed_data={
            'data': tracking_info
        },
    )
    tracking.save()

    return Response({'message': 'Notifications marked as read successfully'}, status=200)

#############################################
# MARK AS READ NOTIFICATIONS
#############################################

@api_view(['POST'])
@permission_classes([AllowAny])
def mark_as_read_notifications(request):
    data = request.data
    userReporter = json.loads(data.get('userReporter', None))
    if not userReporter:
        return Response({'error': 'User not found'}, status=404)
    notification_ids = data.get('notificationIds', [])
    notifications = NotificationUser.objects(id__in=notification_ids).all()
    for notification in notifications:
        notification.read = True
        notification.save()

    tracking_info = [transform_data_to_mongo(notification) for notification in notifications]

    tracking = Tracking(
        user_reporter=userReporter,
        action=f'mark as read notifications',
        created_time=timezone.now(),
        managed_data={
            'data': tracking_info
        },
    )
    tracking.save()

    return Response({'message': 'Notifications marked as read successfully'}, status=200)


#############################################
# DELETE OLD NOTIFICATIONS
#############################################

def delete_old_notifications():
    cutoff = timezone.now() - timezone.timedelta(days=7)
    notifications = Notification.objects(created_time__lt=cutoff).all()
    old_notification_ids = [str(notification.id) for notification in notifications]
    NotificationUser.objects(__raw__={'notification.id': {'$in': old_notification_ids}}).delete()
    notifications.delete()
    return True


#############################################
# DELETE OLD TRACKINGS
#############################################

def delete_old_trackings():
    trackings = Tracking.objects(created_time__lt=timezone.now() - timezone.timedelta(days=30)).all()
    trackings.delete()
    return True

#############################################
# DOWNLOAD MONGO DB
#############################################

@api_view(['GET'])
@permission_classes([AllowAny])
def download_mongo_db(request):
    mongo_uri = settings.MONGO_URI
    db_name = settings.MONGO_DB
    client = MongoClient(mongo_uri)
    db = client[db_name]
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, mode='w', compression=zipfile.ZIP_DEFLATED) as zip_file:
        for collection_name in db.list_collection_names():
            collection = db[collection_name]
            documents = list(collection.find())
            json_data = json_util.dumps(documents, indent=2)
            zip_file.writestr(f"{collection_name}.json", json_data)

    zip_buffer.seek(0)

    timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
    response = HttpResponse(zip_buffer, content_type="application/zip")
    response['Content-Disposition'] = f'attachment; filename="mongo_db_export_{timestamp}.zip"'
    response['Access-Control-Expose-Headers'] = 'Content-Disposition'
    return response



