# ./django/init_scripts.py
import os
import django
from django.utils import timezone
from api_authorization.models import LoginUser

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
            created_time=timezone.now(),
            last_modified_time=timezone.now(),
            first_name='Admin',
            last_name='System',
            gender='M',
            token='superuser',
            user_role={
                'name': 'Superadmin',
                'description': 'Superadmin role'
            }
        )
        superuser.set_password(password)
        superuser.save()
        print("Superuser created!")

if __name__ == "__main__":
    create_superuser()
