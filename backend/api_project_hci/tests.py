import json
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from .models import Specialty, Department, Room, Disability, Patient
from api_project_hci.models import Tracking

class ModelEndpointTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_reporter = json.dumps({"username": "testuser"})
    
    def test_create_specialty_success(self):
        url = reverse('create_model', args=['specialty'])
        data = {
            'userReporter': self.user_reporter,
            'name': 'Cardiology',
            'description': 'Heart related specialty'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('Item created successfully', response.data.get('message', ''))
    
    def test_create_model_existing(self):
        specialty = Specialty(
            name='Neurology',
            description='Brain specialty',
            created_time=timezone.now(),
            last_modified_time=timezone.now()
        )
        specialty.save()
        url = reverse('create_model', args=['specialty'])
        data = {
            'userReporter': self.user_reporter,
            'name': 'Neurology',
            'description': 'Duplicate test'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertIn('already exists', response.data.get('error', ''))
    
    def test_update_model_success(self):
        department = Department(
            name='Radiology',
            description='Initial description',
            created_time=timezone.now(),
            last_modified_time=timezone.now()
        )
        department.save()
        url = reverse('update_model', args=['department', str(department.id)])
        data = {
            'userReporter': self.user_reporter,
            'name': 'Radiology Updated',
            'description': 'Updated description'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Item updated successfully', response.data.get('message', ''))
    
    def test_delete_model_success(self):
        room = Room(
            name='Room101',
            description='Test Room',
            created_time=timezone.now(),
            last_modified_time=timezone.now()
        )
        room.save()
        url = reverse('delete_model', args=['room', str(room.id)])
        data = {'userReporter': self.user_reporter}
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Item deleted successfully', response.data.get('message', ''))

class PatientEndpointTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_reporter = json.dumps({"username": "testuser"})
        self.user_data = json.dumps({"id": "123", "username": "patient1"})
        self.disability_data = json.dumps({"id": "d1", "name": "None"})
    
    def test_create_patient_success(self):
        url = reverse('create_patient')
        data = {
            'userReporter': self.user_reporter,
            'user': self.user_data,
            'disability': self.disability_data
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('Patient created successfully', response.data.get('message', ''))
    
    def test_update_patient_success(self):
        patient = Patient(
            user=json.loads(self.user_data),
            disability=json.loads(self.disability_data),
            created_time=timezone.now(),
            last_modified_time=timezone.now()
        )
        patient.save()
        url = reverse('update_patient', args=[str(patient.id)])
        new_user_data = json.dumps({"id": "123", "username": "patient1_updated"})
        data = {
            'userReporter': self.user_reporter,
            'user': new_user_data,
            'disability': self.disability_data
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Patient updated successfully', response.data.get('message', ''))
    
    def test_delete_patient_success(self):
        patient = Patient(
            user=json.loads(self.user_data),
            disability=json.loads(self.disability_data),
            created_time=timezone.now(),
            last_modified_time=timezone.now()
        )
        patient.save()
        url = reverse('delete_patient', args=[str(patient.id)])
        data = {'userReporter': self.user_reporter}
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Patient deleted successfully', response.data.get('message', ''))
