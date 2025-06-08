# mongo_setup.py
from django.conf import settings
import mongoengine

def connect_mongo():
    try:
        mongoengine.connect(
            db=settings.MONGO_DB,
            host=settings.MONGO_HOST,
            port=settings.MONGO_PORT,
            username=settings.MONGO_USER,
            password=settings.MONGO_PASSWORD,
            authentication_source='admin',
            alias='default'  
        )
        print(f"Connected to MongoDB at {settings.MONGO_HOST}:{settings.MONGO_PORT}, Database: {settings.MONGO_DB}")
    except mongoengine.ConnectionError as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise e
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise e
