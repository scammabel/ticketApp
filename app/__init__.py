from flask import Flask
from .models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore
from .celery_config import celery

def create_app():
    app = Flask(__name__, static_folder='../static', template_folder='../templates')
    app.config.from_object('app.config')
    app.config['USE_THIS_APP_CONTEXT'] = app.app_context
    
    db.init_app(app)

    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    security = Security(app, user_datastore)

    from .routes import register_routes
    register_routes(app, user_datastore)

    celery.conf.update(app.config)

    return app, security

app, _ = create_app()