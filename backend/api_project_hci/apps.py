from django.apps import AppConfig


class ApiProjectHciConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api_project_hci'
    
    def ready(self):
        import api_project_hci.signals
