import os


MAIL_USERNAME = 'dummy@dummy.com'
MAIL_PASSWORD = 'dummy'
MAIL_DEFAULT_SENDER = MAIL_USERNAME

# Database configurations
SQLALCHEMY_DATABASE_URI = 'sqlite:///ticketapp.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Flask-security configurations
SECRET_KEY = 'e7b75a472b1295c2fa8bfc9d1a062a42'
SECURITY_CSRF_ENABLED = False
WTF_CSRF_ENABLED = False
SECURITY_PASSWORD_SALT = 'IVB3RIUHFP4XM3P9XHFHRE'

# Email configurations
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USE_SSL = False

# Celery configurations
result_backend = "redis://localhost:6379/0"
broker_url = "redis://localhost:6379/0"
CACHE_TYPE = 'simple'