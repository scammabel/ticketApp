from app import create_app
from app.models import db, ensure_admin_exists

# Initialize the Flask app
app, _ = create_app()

if __name__ == '__main__':
    # Initialize the database tables and ensure an admin exists
    with app.app_context():
        db.create_all()
        ensure_admin_exists()

    # Start the Flask development server
    app.run(debug=True)
