from django.apps import AppConfig


class ApiUsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api_users'
    
    def ready(self):
        import api_users.signals
