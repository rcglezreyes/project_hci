import json
from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth import get_user_model

class PlatformViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        User = get_user_model()
        self.test_username = "testuser"
        self.test_password = "testpass"
        self.user = User.objects.create_user(username=self.test_username, password=self.test_password)
        self.user.to_mongo = lambda: type("Dummy", (), {"to_dict": lambda: {
            "_id": self.user.id, "username": self.test_username, "password": "hashed_password"
        }})()

    def test_health_check(self):
        response = self.client.get('/health_check/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})

    def test_login_missing_fields(self):
        response = self.client.post('/login/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Username and password required', response.json().get('error', ''))

    def test_login_invalid_json(self):
        response = self.client.post('/login/', data="not a json", content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid JSON', response.json().get('error', ''))

    def test_login_valid_credentials(self):
        payload = {
            'username': self.test_username,
            'password': self.test_password
        }
        response = self.client.post('/login/', json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json().get('data')
        self.assertIsNotNone(data)
        self.assertEqual(data.get('username'), self.test_username)
        self.assertTrue(self.client.session.get('user_id'))

    def test_login_invalid_credentials(self):
        payload = {
            'username': self.test_username,
            'password': 'wrongpassword'
        }
        response = self.client.post('/login/', json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        json_response = response.json()
        self.assertIn('Invalid credentials', json_response.get('error', ''))

    def test_logout_with_user_reporter(self):
        payload = {
            'userReporter': {
                'username': self.test_username,
            }
        }
        response = self.client.post('/logout/', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('data'), 'User logged out')

    def test_logout_without_user_reporter(self):
        response = self.client.post('/logout/', data=json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('User not logged in', response.json().get('error', ''))
