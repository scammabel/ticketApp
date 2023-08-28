from celery import Celery
from celery.schedules import crontab

def make_celery(app_name=__name__):
    celery_instance = Celery(app_name, broker="redis://localhost:6379/0", backend="redis://localhost:6379/0")
    
    celery_instance.conf.beat_schedule = {
        'send-reminder-every-day': {
            'task': 'app.routes.send_daily_reminders',
            'schedule': crontab(hour=10, minute=0) # At 10 am every day
            #'schedule': 60.0  # Every minute for testing;
        },
        'send-monthly-report': {
            'task': 'app.routes.send_monthly_report',
            'schedule': crontab(day_of_month=1, hour=0, minute=0)  # First day of every month at midnight
        }
    }
    
    return celery_instance

celery = make_celery()
