from flask import Flask

from .models import db, User

SECRET_KEY = 'e7b75a472b1295c2fa8bfc9d1a062a42'

def create_app():
    app = Flask(__name__, static_folder='../static', template_folder='../templates')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ticketapp.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config["SECURITY_PASSWORD_SALT"] = "IVB3RIUHFP4XM3P9XHFHRE"

    db.init_app(app)

    from .routes import register_routes
    register_routes(app)

    return app
