import json
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from .models import UserRole
from api_authorization.models import LoginUser
from api_project_hci.models import Tracking, Patient, MedicalStaff, Admission

class UserRoleTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_reporter = {"username": "testuser"}
        self.role_data = {
            "name": "Admin",
            "description": "Administrator role",
            "userReporter": self.user_reporter
        }

    def test_create_user_role_success(self):
        url = reverse('create_user_role')
        response = self.client.post(url, self.role_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('User role created successfully', response.data.get('success', ''))

    def test_create_user_role_existing(self):
        url = reverse('create_user_role')
        self.client.post(url, self.role_data, format='json')
        response = self.client.post(url, self.role_data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('User role already exists', response.data.get('error', ''))

    def test_edit_user_role_success(self):
        url_create = reverse('create_user_role')
        self.client.post(url_create, self.role_data, format='json')
        user_role = UserRole.objects.filter(name="Admin").first()
        url_edit = reverse('edit_user_role', args=[str(user_role.id)])
        edit_data = {
            "name": "AdminUpdated",
            "description": "Updated description",
            "userReporter": self.user_reporter
        }
        response = self.client.post(url_edit, edit_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('User role created successfully', response.data.get('success', ''))

    def test_delete_user_role_success(self):
        url_create = reverse('create_user_role')
        self.client.post(url_create, self.role_data, format='json')
        user_role = UserRole.objects.filter(name="Admin").first()
        url_delete = reverse('delete_user_role', args=[str(user_role.id)])
        data = {"userReporter": self.user_reporter}
        response = self.client.delete(url_delete, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('User role deleted successfully', response.data.get('success', ''))

    def test_delete_user_roles_success(self):
        url_create = reverse('create_user_role')
        self.client.post(url_create, self.role_data, format='json')
        role = UserRole.objects.filter(name="Admin").first()
        url_delete = reverse('delete_user_roles')
        data = {"userReporter": self.user_reporter, "userRoleIds": [str(role.id)]}
        response = self.client.delete(url_delete, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('User roles deleted successfully', response.data.get('success', ''))

class UserTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_reporter = {"username": "admin"}
        self.role = UserRole.objects.create(
            name="User",
            description="Standard user",
            created_time=timezone.now(),
            last_modified_time=timezone.now()
        )
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "firstName": "Test",
            "lastName": "User",
            "phoneNumber": "1234567890",
            "role": str(self.role.id),
            "password": "testpass",
            "userReporter": self.user_reporter,
            "avatarUrl": "",
            "birthDate": "2000-01-01",
            "address": "123 Test St",
            "gender": "Other"
        }

    def test_create_user_success(self):
        url = reverse('create_user')
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('User created successfully', response.data.get('success', ''))

    def test_edit_user_success(self):
        url_create = reverse('create_user')
        self.client.post(url_create, self.user_data, format='json')
        user = LoginUser.objects.filter(username="testuser").first()
        url_edit = reverse('edit_user', args=[str(user.id)])
        edit_data = {
            "username": "testuser_updated",
            "email": "updated@example.com",
            "firstName": "Updated",
            "lastName": "User",
            "phoneNumber": "0987654321",
            "role": str(self.role.id),
            "password": "",
            "userReporter": self.user_reporter,
            "birthDate": "2000-01-01",
            "address": "123 Updated St",
            "gender": "Other"
        }
        response = self.client.post(url_edit, edit_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('User updated successfully', response.data.get('success', ''))

    def test_change_password_success(self):
        url_create = reverse('create_user')
        self.client.post(url_create, self.user_data, format='json')
        user = LoginUser.objects.filter(username="testuser").first()
        url_change = reverse('change_password', args=[str(user.id)])
        change_data = {
            "isSameUser": "same",
            "password": "testpass",
            "newPassword": "newpass123",
            "confirmPassword": "newpass123"
        }
        response = self.client.post(url_change, change_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Password updated successfully', response.data.get('message', ''))

    def test_delete_user_success(self):
        url_create = reverse('create_user')
        self.client.post(url_create, self.user_data, format='json')
        user = LoginUser.objects.filter(username="testuser").first()
        url_delete = reverse('delete_user', args=[str(user.id)])
        data = {"userReporter": self.user_reporter}
        response = self.client.delete(url_delete, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('User deleted successfully', response.data.get('message', ''))

    def test_delete_users_success(self):
        url_create = reverse('create_user')
        self.client.post(url_create, self.user_data, format='json')
        user = LoginUser.objects.filter(username="testuser").first()
        url_delete = reverse('delete_users')
        data = {"userReporter": self.user_reporter, "userIds": [str(user.id)]}
        response = self.client.delete(url_delete, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Users deleted successfully', response.data.get('message', ''))
