# ./django/init_scripts.py
import os
import django
from datetime import datetime
from api_authorization.models import LoginUser
from api_projects.models import ProjectPermissions

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'system_project_hci.settings')
django.setup()

# connect_mongo()

def create_superuser():
    username = os.getenv('DJANGO_SUPERUSER_USERNAME')
    email = os.getenv('DJANGO_SUPERUSER_EMAIL')
    password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

    if not LoginUser.objects(username=username).first():
        print("Creating superuser...")
        superuser = LoginUser(
            username=username,
            email=email,
            is_staff=True,
            is_active=True,
            date_joined=datetime.now(),
        )
        superuser.set_password(password)
        superuser.save()
        print("Superuser created!")

if __name__ == "__main__":
    create_superuser()
