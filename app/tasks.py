from .models import User, Booking, Role, roles_users, Show
from flask_mail import Mail, Message
from celery.schedules import crontab
from sqlalchemy import extract
from datetime import timedelta, date

mail = Mail()

def init_tasks(celery):
    mail.init_app(current_app)

    # Decorate tasks with the valid celery instance
    @celery.task
    def daily_reminders_task():
        send_daily_reminders()

    @celery.task
    def monthly_report_task():
        send_monthly_report()

    @celery.task
    def export_csv_task(theatre_id):
        export_theatre_to_csv(theatre_id)
        
    @celery.on_after_configure.connect
    def setup_periodic_tasks(sender, **kwargs):
        sender.add_periodic_task(crontab(hour=18, minute=0), daily_reminders_task.s())
        sender.add_periodic_task(crontab(day_of_month=1, hour=9, minute=0), monthly_report_task.s())



def send_daily_reminders():
    users = User.query.join(roles_users).join(Role).filter(Role.name == 'user').all()
    for user in users:
        booking_count = Booking.query.filter_by(user_id=user.id).count()
        if booking_count == 0:
            send_email_reminder(user.email)

def send_monthly_report():
    users = User.query.all()
    last_month = date.today().month - 1
    for user in users:
        bookings = Booking.query.filter_by(user_id=user.id).filter(extract('month', Booking.booking_time) == last_month).all()
        report = generate_report_for_user(user, bookings)
        send_email_report(user.email, report)

def export_theatre_to_csv(theatre_id):
    shows = Show.query.filter_by(theatre_id=theatre_id).all()
    csv_data = convert_to_csv(shows)
    filename = f"theatre_{theatre_id}_export.csv"
    with open(filename, 'w') as f:
        f.write(csv_data)
    admin_email = User.query.filter_by(roles_name='admin').first().email
    send_export_completion_notification(admin_email, filename)

def send_email_reminder(email):
    msg = Message("Reminder to Book", recipients=[email])
    msg.body = "Hey! We noticed you haven't made any bookings. Check out our latest shows!"
    mail.send(msg)

def generate_report_for_user(user, bookings):
    return str(bookings)

def send_email_report(email, report):
    msg = Message("Monthly Entertainment Report", recipients=[email])
    msg.html = report
    mail.send(msg)

def send_export_completion_notification(email, filename):
    msg = Message("CSV Export Completed", recipients=[email])
    msg.body = f"Your CSV export is complete. You can download it from {filename}."
    mail.send(msg)

def convert_to_csv(shows):
    csv_data = "Show ID, Show Name, Rating\n"
    for show in shows:
        csv_data += f"{show.id}, {show.name}, {show.rating}\n"
    return csv_data