from bson.objectid import ObjectId
from django.utils import timezone
from datetime import datetime
from dateutil import parser
from collections import defaultdict
from .models import Notification, NotificationUser
from api_authorization.models import LoginUser
import json

def transform_data_to_mongo(data, exclude_fields=None, include_fields=None):
    if isinstance(data, dict):
        for key, value in data.items():
            data[key] = transform_data_to_mongo(value)
        if not 'id' in data and '_id' in data:
            data['id'] = data.get('_id', None)
    else:
        data = data.to_mongo().to_dict()
        if '_id' in data and isinstance(data['_id'], ObjectId):
            data['_id'] = str(data['_id'])
            data['id'] = data['_id']
    if exclude_fields:
        for field in exclude_fields:
            if field in data:
                del data[field]
    if include_fields:
        for field in list(data.keys()):
            if field not in include_fields:
                del data[field]
    return data


def serialize_datetime(value):
    if isinstance(value, datetime):
        return value.isoformat()
    elif isinstance(value, dict):
        return {key: serialize_datetime(val) for key, val in value.items()}
    elif isinstance(value, list):
        return [serialize_datetime(item) for item in value]
    else:
        return value
    
    
def dynamic_field_to_json(data):
    if isinstance(data, str):
        try:
            return json.loads(data)
        except Exception:
            return data
    return data


def parse_custom_date(logger, date_str):
    try:
        return parser.parse(date_str)
    except Exception as e:
        if logger:
            logger.warning(f'Error parsing date: {e}')
        return None
    
    
def to_aware(dt):
    if isinstance(dt, str):
        dt = parse_custom_date(None, dt)
    if dt is None:
        return dt
    if dt.tzinfo is None:
        return timezone.make_aware(dt, timezone.get_default_timezone())
    return dt


def create_notification(module, info_id, info, type, username):
    notification = Notification(
        module=module,
        info_id=str(info_id),
        info=info,
        type=type,
        created_time=timezone.now(),
        last_modified_time=timezone.now(),
    )
    
    notification.save()
    
    user = LoginUser.objects(username=username).first()
    
    username = user.username if user else 'System Job'
    
    all_users = LoginUser.objects.all()
    
    for user in all_users:
        user_notification = NotificationUser(
            notification=transform_data_to_mongo(notification),
            username=username,
            user=transform_data_to_mongo(user, exclude_fields=['password']),
            created_time=timezone.now(),
            last_modified_time=timezone.now(),
        )
        user_notification.save()
    
    return notification