from app import create_app
from app.models import db, ensure_admin_exists

app, _ = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)