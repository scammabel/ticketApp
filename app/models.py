from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_default_user():
    user = User.query.filter_by(username='testuser').first()
    if not user:
        default_user = User(
            username='testuser',
            password='testpassword',
            email='test@email.com',
            active=True
        )
        db.session.add(default_user)
        db.session.commit()
        print("Test user created!")
    else:
        print("Test user already exists!")


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    active = db.Column(db.Boolean, default=True)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'active': self.active
        }


class Theatre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    place = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'place': self.place,
            'capacity': self.capacity
        }


class Show(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    tags = db.Column(db.String(200), nullable=False)
    ticket_price = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'rating': self.rating,
            'tags': self.tags,
            'ticket_price':self.ticket_price
        }

class Showtime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    show_id = db.Column(db.Integer, db.ForeignKey('show.id'), nullable=False)
    theatre_id = db.Column(db.Integer, db.ForeignKey('theatre.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    show = db.relationship('Show', backref='showtimes')
    theatre = db.relationship('Theatre', backref='showtimes')

    def serialize(self):
        return {
            'id': self.id,
            'show_id': self.show_id,
            'theatre_id': self.theatre_id,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            'show': {
                'id': self.show.id,
                'name': self.show.name,
            },
            'theatre': {
                'id': self.theatre.id,
                'name': self.theatre.name,
            }
        }


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    showtime_id = db.Column(db.Integer, db.ForeignKey('showtime.id'), nullable=False)
    number_of_tickets = db.Column(db.Integer, nullable=False)
    booking_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    user = db.relationship('User', backref='bookings')
    showtime = db.relationship('Showtime', backref='bookings')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'showtime_id': self.showtime_id,
            'number_of_tickets': self.number_of_tickets,
            'booking_time': self.booking_time.strftime('%Y-%m-%d %H:%M:%S'),  # Convert datetime to string
            'status': self.status,
            'user': self.user.serialize() if self.user else None,  # Assuming User model has a serialize method
            'showtime': self.showtime.serialize() if self.showtime else None  # Assuming Showtime model has a serialize method
        }

