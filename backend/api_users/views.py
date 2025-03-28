from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from api_project_hci.data_util import (
    transform_data_to_mongo,
    create_notification,
)
from .models import UserRole
from api_authorization.models import LoginUser
from api_project_hci.models import (
    Tracking,
    Patient,
    MedicalStaff,
    Admission,
)
import json
import logging

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)


#############################################
# CREATE USER ROLE
#############################################

@api_view(['POST'])
@permission_classes([AllowAny])
def create_user_role(request): 
    data = request.data
    name = data.get('name')
    description = data.get('description')
    user_reporter = json.loads(data.get('userReporter'))
    
    if not name:
        return Response({'error': 'Name is required'}, status=400)
    
    try:
        user_role = UserRole.objects.filter(name=name).first()
        if user_role:
            return Response({'error': 'User role already exists'}, status=400)
        
        user_role = UserRole(
            name=name,
            description=description,
            created_time=timezone.now(),
            last_modified_time=timezone.now(),
        )
        
        user_role.save()
        
        logger.info(f'Created user role with id {user_role.id} and name {user_role.name}')
        
        tracking_info = transform_data_to_mongo(user_role)
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'create rol user ({user_role.id} - {user_role.name})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        
        if user_reporter:
            module='user_roles'
            info=f'has created a new user role ({user_role.name})'
            info_id=user_role.id
            type='create_user_role'
            create_notification(module, info_id, info, type, user_reporter['username'])
        
        return Response({'success': 'User role created successfully'}, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    
#############################################
# EDIT USER ROLE
#############################################

@api_view(['PUT'])
@permission_classes([AllowAny])
def edit_user_role(request, id): 
    try:
        user_role = UserRole.objects.filter(id=id).first()
        if not user_role:
            return Response({'error': 'User role does not exist'}, status=400)
        
        data = request.data
        name = data.get('name')
        description = data.get('description')
        user_reporter = json.loads(data.get('userReporter'))
        
        if not name:
            return Response({'error': 'Name is required'}, status=400)
    
        check_user_role = UserRole.objects.filter(name=name).first()
        if check_user_role and check_user_role.id != user_role.id:
            return Response({'error': 'User role already exists'}, status=400)
        
        user_role.name = name
        user_role.description = description
        user_role.last_modified_time = timezone.now()
        user_role.save()
        
        logger.info(f'Updated user role with id {user_role.id} and name {user_role.name}')
        
        tracking_info = transform_data_to_mongo(user_role)
        
        users = LoginUser.objects.all()
        users = [user for user in users if str(user.user_role.get('id', None)) == id]
        for user in users:
            user.user_role = tracking_info
            user.save()
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'edit rol user ({user_role.id} - {user_role.name})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module='user_roles'
            info=f'has updated a user role ({user_role.name})'
            info_id=user_role.id
            type='update_user_role'
            create_notification(module, info_id, info, type, user_reporter['username'])
        
        return Response({'success': 'User role created successfully'}, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    

#############################################
# DELETE USER ROLE
#############################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_user_role(request, id): 
    try:
        user_role = UserRole.objects.filter(id=id).first()
        if not user_role:
            return Response({'error': 'User role does not exist'}, status=400)
        
        data = request.data
        user_reporter = json.loads(data.get('userReporter'))
        
        users = LoginUser.objects.all()
        users = [user for user in users if str(user.user_role.get('id', None)) == id]
        if users:
            return Response({'error': 'User role is in use'}, status=400)
        
        tracking_info = transform_data_to_mongo(user_role)
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete rol user ({user_role.id} - {user_role.name})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')

        user_role.delete()

        logger.info(f'Deleted user role with id {user_role.id} and name {user_role.name}')
        
        if user_reporter:
            module='user_roles'
            info=f'has deleted a user role ({user_role.name})'
            info_id=user_role.id
            type='delete_user_role'
            create_notification(module, info_id, info, type, user_reporter.get('username', None))
        
        return Response({'success': 'User role deleted successfully'}, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    
#############################################
# DELETE USER ROLES
#############################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_user_roles(request): 
    try:
        data = request.data
        user_reporter = json.loads(data.get('userReporter'))
        ids = data.get('userRoleIds')
        
        user_roles = UserRole.objects(id__in=ids)
        if not user_roles:
            return Response({'error': 'User roles not found'}, status=404)
        
        users = LoginUser.objects.all()
        
        for user_role in user_roles:
            users = [user for user in users if str(user.user_role.get('id', None)) == str(user_role.id)]
            if users:
                return Response({'error': 'User role(s) in use'}, status=400)
        
        user_roles.delete()
        
        logger.info(f'Deleted user roles with ids {", ".join([str(user_role.name) for user_role in user_roles])}')
        
        tracking_info = [transform_data_to_mongo(user_role) for user_role in user_roles]
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete user roles ({", ".join([user_role.name for user_role in user_roles])})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module='user_roles'
            info=f'has deleted {len(user_roles)} user roles'
            info_id='list'
            type='delete_user_roles'
            create_notification(module, info_id, info, type, user_reporter['username'])
        
        return Response({'success': 'User roles deleted successfully'}, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    
#############################################
# CREATE USER
#############################################

@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request): 
    data = request.data
    username = data.get('username')
    email = data.get('email')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    phone_number = data.get('phoneNumber')
    role = data.get('role')
    password = data.get('password')
    user_reporter = json.loads(data.get('userReporter'))
    avatar_url = data.get('avatarUrl')
    address = data.get('address')
    gender = data.get('gender')
    
    try:
        user = LoginUser.objects.filter(username=username).first()
        if user:
            return Response({'error': 'User already exists'}, status=400)
        
        role = UserRole.objects.filter(id=role).first()
        if not role:
            return Response({'error': 'Role does not exist'}, status=400)
        role = transform_data_to_mongo(role)

        if not password:
            return Response({'error': 'Password is required'}, status=400)
        
        user = LoginUser(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            user_role=role,
            is_active=True,
            avatar_url=avatar_url,
            address=address,
            gender=gender,
            created_time=timezone.now(),
            last_modified_time=timezone.now(),
        )

        user.set_password(password)

        user.save()
        
        logger.info(f'Created user with id {user.id} and username {user.username}')
        
        tracking_info = transform_data_to_mongo(user, exclude_fields=['password'])
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'create user ({user.id} - {user.username})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module='users'
            info=f'has created a new user ({user.username})'
            info_id=user.id
            type='create_user'
            create_notification(module, info_id, info, type, user_reporter['username'])
        
        return Response({'success': 'User created successfully'}, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    
    
#############################################
# EDIT USER
#############################################

@api_view(['PUT'])
@permission_classes([AllowAny])
def edit_user(request, id): 
    try:
        user = LoginUser.objects.filter(id=id).first()
        if not user:
            return Response({'error': 'User does not exist'}, status=400)
        
        data = request.data
        username = data.get('username')
        email = data.get('email')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        phone_number = data.get('phoneNumber')
        role = data.get('role')
        password = data.get('password')
        user_reporter = json.loads(data.get('userReporter'))
        address = data.get('address')
        gender = data.get('gender')
    
    
        check_user = LoginUser.objects.filter(username=username).first()
        if check_user and check_user.id != user.id:
            return Response({'error': 'User already exists'}, status=400)
        
        role = UserRole.objects.filter(id=role).first()
        if not role:
            return Response({'error': 'Role does not exist'}, status=400)
        
        role = transform_data_to_mongo(role)
        
        user.username = username if username else user.username
        user.email = email if email else user.email
        user.first_name = first_name if first_name else user.first_name
        user.last_name = last_name if last_name else user.last_name
        user.phone_number = phone_number if phone_number else user.phone_number
        user.user_role = role if role else user.user_role
        user.address = address if address else user.address
        user.gender = gender if gender else user.gender
        user.last_modified_time = timezone.now()
        if password:
            user.set_password(password)
        user.save()
        
        logger.info(f'Updated user with id {user.id} and username {user.username}')
        
        tracking_info = transform_data_to_mongo(user, exclude_fields=['password'])
        
        patients = Patient.objects.all()
        patients = [patient for patient in patients if str(patient.user.get('id', None)) == id]
        if patients:
            for patient in patients:
                patient.user = tracking_info
                patient.save()
                
                admissions = Admission.objects.all()
                admissions = [admission for admission in admissions if str(admission.patient.get('id', None)) == id]
                for admission in admissions:
                    admission.patient = tracking_info
                    admission.save()
        
        medical_staffs = MedicalStaff.objects.all()
        medical_staffs = [medical_staff for medical_staff in medical_staffs if str(medical_staff.user.get('id', None)) == id]
        if medical_staffs:
            for medical_staff in medical_staffs:
                medical_staff.user = tracking_info
                medical_staff.save()

                admissions = Admission.objects.all()
                admissions = [admission for admission in admissions if str(admission.medical_staff.get('id', None)) == id]
                for admission in admissions:
                    admission.medical_staff = tracking_info
                    admission.save()
                
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'edit user ({user.id} - {user.username})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module='users'
            info=f'has updated a user ({user.username})'
            info_id=user.id
            type='update_user'
            create_notification(module, info_id, info, type, user_reporter['username'])
        
        return Response({'success': 'User updated successfully'}, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    

#############################################
# CHANGE PASSWORD
#############################################

@api_view(['POST'])
@permission_classes([AllowAny])
def change_password(request, id):
    data = request.data
    same_user = data.get('isSameUser')
    current_password = data.get('password')
    new_password = data.get('newPassword')
    confirm_password = data.get('confirmPassword')
    
    try:
        user = LoginUser.objects(id=id).first()
    except LoginUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    
    if same_user == 'same' and not user.check_password(current_password):
        return Response({'error': 'Current password is incorrect'}, status=400)
    
    if new_password != confirm_password:
        return Response({'error': 'New password and confirm password must match'}, status=400)
    
    user.set_password(new_password)
    user.save()
    
    logger.info(f'Changed password for user with id {user.id} and username {user.username}')
    
    tracking_info = transform_data_to_mongo(user, exclude_fields=['password'])
    
    tracking = Tracking(
        user_reporter=tracking_info,
        action=f'change password user ({user.id} - {user.username})',
        created_time=timezone.now(),
        managed_data={
            'data': tracking_info
        },
    )
    
    tracking.save()
    
    logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
    
    return Response({'message': 'Password updated successfully'}, status=200)


#############################################
# DELETE USER
#############################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_user(request, id):
    data = request.data
    user_reporter = json.loads(data.get('userReporter'))
    try:
        user = LoginUser.objects(id=id).first()
        if not user:
            return Response({'error': 'User not found'}, status=404)
        
        if user.username == user_reporter['username']:
            return Response({'error': 'You cannot delete your own account'}, status=400)
        
        tracking_info = transform_data_to_mongo(user, exclude_fields=['password'])
        
        patients = Patient.objects.all()
        patients = [patient for patient in patients if str(patient.user.get('id', None)) == id]
        if patients:
            patients.delete()
        
        medical_staffs = MedicalStaff.objects.all()
        medical_staffs = [medical_staff for medical_staff in medical_staffs if str(medical_staff.user.get('id', None)) == id]
        if medical_staffs:
            medical_staffs.delete()

        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete user ({user.id} - {user.username})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )

        tracking.save()
        
        logger.info(f'Created tracking with id {tracking.id} and action {tracking.action}')
        
        if user_reporter:
            module='users'
            info=f'has deleted a user ({user.username})'
            info_id=user.id
            type='delete_user'
            create_notification(module, info_id, info, type, user_reporter['username'])

        user.delete()

        logger.info(f'Deleted user with id {user.id} and username {user.username}')
        
        return Response({'message': 'User deleted successfully'}, status=200)
    except LoginUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        
#############################################
# DELETE USERS
#############################################

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_users(request):
    data = request.data
    user_reporter = json.loads(data.get('userReporter'))
    ids = data.get('userIds')
    try:
        users = LoginUser.objects(id__in=ids)
        if not users:
            return Response({'error': 'Users not found'}, status=404)
        
        tracking_info = [transform_data_to_mongo(user, exclude_fields=['password']) for user in users]
        
        patients = Patient.objects(user__id__in=ids).all()
        if patients:
            patients.delete()

        
        medical_staffs = MedicalStaff.objects(user__id__in=ids).all()
        if medical_staffs:
            medical_staffs.delete()
        
        tracking = Tracking(
            user_reporter=user_reporter,
            action=f'delete users ({", ".join([user.username for user in users])})',
            created_time=timezone.now(),
            managed_data={
                'data': tracking_info
            },
        )
        tracking.save()
        
        if user_reporter:
            module='users'
            info=f'has deleted {len(users)} users'
            info_id='list'
            type='delete_users'
            create_notification(module, info_id, info, type, user_reporter['username'])

        users.delete()

        logger.info(f'Deleted users with ids {", ".join([str(user.username) for user in users])}')
        
        return Response({'message': 'Users deleted successfully'}, status=200)
    except LoginUser.DoesNotExist:
            return Response({'error': 'Users not found'}, status=404)
