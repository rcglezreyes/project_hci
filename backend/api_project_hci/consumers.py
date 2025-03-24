from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
import json


######################################################
# SPECIALTY
######################################################

class SpecialtyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "specialty", 
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "specialty",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def specialty_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))
        
        
######################################################
# DEPARTMENT
######################################################
        
        
class DepartmentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "department", 
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "department",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def department_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))
        
        
######################################################
# ROOM
######################################################


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "room",  
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "room",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def room_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))
        

######################################################
# DISABILITY
######################################################


class DisabilityConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "disability",  
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "disability",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def disability_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))


######################################################
# DIAGNOSIS
######################################################

class DiagnosisConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "diagnosis",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "diagnosis",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def diagnosis_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))
        
        
######################################################
# PATIENT
######################################################


class PatientConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "patient",  
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "patient",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def patient_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))
        
        
######################################################
# MEDICAL STAFF
######################################################


class MedicalStaffConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "medical_staff",  
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "medical_staff",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def medical_staff_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))
        
        
######################################################
# ADMISSION
######################################################


class AdmissionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "admission",  
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "admission",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def admission_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))


######################################################
# NOTIFICATIONS
######################################################


class NotificationUserConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "notification_user",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "notification_user",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def notification_user_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))


######################################################
# TRACKINGS
######################################################


class TrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "tracking",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "tracking",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def tracking_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))