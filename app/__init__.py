from flask import Flask, current_app
from .models import db, User, Role, Booking, roles_users, Show
from flask_security import Security, SQLAlchemyUserDatastore



def create_app():
    app = Flask(__name__, static_folder='../static', template_folder='../templates')
    app.config.from_object('app.config')
    

    db.init_app(app)
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, user_datastore)
    
    from .routes import register_routes
    register_routes(app, user_datastore)
    
    return app
