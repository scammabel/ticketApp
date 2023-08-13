from app import create_app
from app.models import db, create_default_user


app = create_app()


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        create_default_user()
    app.run(debug=True)
