# tu_app/models.py

import mongoengine
from mongoengine import (
    Document, 
    StringField, 
    DateTimeField, 
    DynamicField,
)
from django.contrib.auth.hashers import (
    make_password, 
    check_password
)
    
class LoginUser(Document):
    username = StringField(max_length=150, unique=True, required=True)
    first_name = StringField(max_length=30, required=False)
    last_name = StringField(max_length=30, required=False)
    email = StringField(max_length=254, required=False)
    created_time = DateTimeField(default=mongoengine.fields.DateTimeField().default)
    last_modified_time = DateTimeField(default=mongoengine.fields.DateTimeField().default)
    phone_number = StringField(max_length=50, required=False)
    gender = StringField(max_length=50, required=False)
    password = StringField(required=True)
    last_login = DateTimeField(default=mongoengine.fields.DateTimeField().default)
    token = StringField(max_length=255, required=False)
    user_role = DynamicField(required=False)
    avatar_url = StringField(max_length=255, required=False)
    address = StringField(required=False)

    meta = {
        'collection': 'login_users',
        'indexes': ['username', 'email', 'token'],
    }

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def __str__(self):
        return self.username
