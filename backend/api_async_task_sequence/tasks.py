from celery import shared_task, chain
from api_project_hci.tasks import (
    task_delete_old_notifications,
    task_delete_old_trackings,
)

@shared_task
def task_sequence_daily():
    workflow = chain(
        task_delete_old_notifications.si(),
        task_delete_old_trackings.si(),
    )
    workflow.apply_async()