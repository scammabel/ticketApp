from flask import Flask, request, render_template
from flask_restful import Api, Resource, reqparse
from .models import db, Theatre, Show, Showtime, Booking, User
from datetime import datetime


def register_routes(app):

    api = Api(app)

    @app.route('/')
    def index():
        return render_template('index.html')

    class TheatreResource(Resource):
        def post(self):
            parser = reqparse.RequestParser()
            parser.add_argument('name', required=True, help="Name cannot be blank!")
            parser.add_argument('place', required=True, help="Place cannot be blank!")
            parser.add_argument('capacity', type=int, required=True, help="Capacity cannot be blank and must be an integer!")
            
            args = parser.parse_args()

            if args['capacity'] <= 0:
                return {'message': 'Capacity must be greater than 0'}, 400

            theatre = Theatre(name=args['name'], place=args['place'], capacity=args['capacity'])
            db.session.add(theatre)
            db.session.commit()

            return {'message': 'Theatre created successfully', 'id': theatre.id}, 201
        
        def put(self, theatre_id):
            theatre = Theatre.query.get_or_404(theatre_id)
            parser = reqparse.RequestParser()
            parser.add_argument('name', required=True, help="Name cannot be blank!")
            parser.add_argument('place', required=True, help="Place cannot be blank!")
            parser.add_argument('capacity', type=int, required=True, help="Capacity cannot be blank and must be an integer!")

            args = parser.parse_args()

            if args['capacity'] <= 0:
                return {'message': 'Capacity must be greater than 0'}, 400

            theatre.name = args.get('name', theatre.name)
            theatre.place = args.get('place', theatre.place)
            theatre.capacity = args.get('capacity', theatre.capacity)
            db.session.commit()

            return {'message': 'Theatre updated successfully'}, 200

        def delete(self, theatre_id):
            theatre = Theatre.query.get_or_404(theatre_id)
            db.session.delete(theatre)
            db.session.commit()

            return {'message': 'Theatre deleted successfully'}, 200
        
        def get(self, theatre_id=None):
            if theatre_id:
                theatre = Theatre.query.get_or_404(theatre_id)
                return {'theatre': theatre.serialize()}
            else:
                theatres = Theatre.query.all()
                return {'theatres': [theatre.serialize() for theatre in theatres]}

    
    class ShowResource(Resource):
    
        def post(self):
            parser = reqparse.RequestParser()
            parser.add_argument('name', required=True, help="Name cannot be blank!")
            parser.add_argument('rating', type=float, required=True, help="Rating cannot be blank!")
            parser.add_argument('tags', required=True, help="Tags cannot be blank!")
            parser.add_argument('ticket_price', type=float, required=True, help="Ticket price cannot be blank!")

            args = parser.parse_args()

            if args['ticket_price'] <= 0:
                return {'message': 'Price must be greater than 0'}, 400

            show = Show(name=args['name'], rating=args['rating'], tags=args['tags'], ticket_price=args['ticket_price'])
            db.session.add(show)
            db.session.commit()

            return {'message': 'Show created successfully', 'id': show.id}, 201

        def put(self, show_id):
            show = Show.query.get_or_404(show_id)
            parser = reqparse.RequestParser()
            parser.add_argument('name', required=True, help="Name cannot be blank!")
            parser.add_argument('rating', type=float, required=True, help="Rating cannot be blank!")
            parser.add_argument('tags', required=True, help="Tags cannot be blank!")
            parser.add_argument('ticket_price', type=float, required=True, help="Ticket price cannot be blank!")

            args = parser.parse_args()

            if args['ticket_price'] <= 0:
                return {'message': 'Price must be greater than 0'}, 400

            show.name = args.get('name', show.name)
            show.rating = args.get('rating', show.rating)
            show.tags = args.get('tags', show.tags)
            show.ticket_price = args.get('ticket_price', show.ticket_price)

            db.session.commit()

            return {'message': 'Show updated successfully'}, 200

        def delete(self, show_id):
            show = Show.query.get_or_404(show_id)
            showtimes = Showtime.query.filter_by(show_id=show_id).all()

            for showtime in showtimes:
                Booking.query.filter_by(showtime_id=showtime.id).delete()   # Delete bookings associated with the showtimes
            
            Showtime.query.filter_by(show_id=show_id).delete()      # Delete the showtimes
            db.session.delete(show)     # Delete the show
            db.session.commit()

            return {'message': 'Show deleted successfully'}, 200
        
        def get(self, show_id=None):
            if show_id:
                # Fetch a specific show by ID
                show = Show.query.get_or_404(show_id)
                return {'show': show.serialize()}
            else:
                # Fetch all shows or filter by search term
                search_term = request.args.get('search_term')
                if search_term:
                    shows = Show.query.filter(Show.name.contains(search_term)).all()
                else:
                    shows = Show.query.all()
                return {'shows': [show.serialize() for show in shows]}

    class ShowtimeResource(Resource):
        def post(self):
            parser = reqparse.RequestParser()
            parser.add_argument('show_id', type=int, required=True, help="Show ID cannot be blank!")
            parser.add_argument('theatre_id', type=int, required=True, help="Theatre ID cannot be blank!")
            parser.add_argument('start_time', required=True, help="Start time cannot be blank!")
            parser.add_argument('end_time', required=True, help="End time cannot be blank!")

            args = parser.parse_args()

            start_time = datetime.fromisoformat(args['start_time'])
            end_time = datetime.fromisoformat(args['end_time'])
            
            showtime = Showtime(show_id=args['show_id'], theatre_id=args['theatre_id'], start_time=start_time, end_time=end_time)
            db.session.add(showtime)
            db.session.commit()

            return {'message': 'Showtime created successfully', 'id': showtime.id}, 201
        
        def get(self, showtime_id=None):
            if showtime_id:
                showtime = Showtime.query.get(showtime_id)
                if showtime:
                    return {'id': showtime.id, 'show_id': showtime.show_id, 'theatre_id': showtime.theatre_id, 'start_time': showtime.start_time.isoformat(), 'end_time': showtime.end_time.isoformat()}
                else:
                    return {'message': 'Showtime not found'}, 404
            else:
                showtimes = Showtime.query.all()
                return [{'id': s.id, 'show_id': s.show_id, 'theatre_id': s.theatre_id, 'start_time': s.start_time.isoformat(), 'end_time': s.end_time.isoformat()} for s in showtimes]

        def delete(self, showtime_id):
            showtime = Showtime.query.get(showtime_id)
            if showtime:
                db.session.delete(showtime)
                db.session.commit()
                return {'message': f'Showtime with ID {showtime_id} deleted successfully'}, 200
            else:
                return {'message': 'Showtime not found'}, 404

    class BookingResource(Resource):
        def post(self):
            parser = reqparse.RequestParser()
            # Remove this line if you always want to use the default user
            # parser.add_argument('user_id', type=int, required=True, help="User ID cannot be blank!")
            parser.add_argument('showtime_id', type=int, required=True, help="Showtime ID cannot be blank!")
            parser.add_argument('number_of_tickets', type=int, required=True, help="Number of tickets cannot be blank!")
            default_user = User.query.filter_by(username='testuser').first()

            args = parser.parse_args()

            # Check availability considering existing bookings
            showtime = Showtime.query.get_or_404(args['showtime_id'])
            existing_tickets = sum(booking.number_of_tickets for booking in showtime.bookings if booking.status != 'cancelled')
            if showtime.theatre.capacity - existing_tickets < args['number_of_tickets']:
                return {'message': 'Not enough tickets available'}, 400

            booking = Booking(user_id=default_user.id, showtime_id=args['showtime_id'], number_of_tickets=args['number_of_tickets'], booking_time=datetime.now(), status='confirmed')
            db.session.add(booking)
            db.session.commit()

            return {'message': 'Booking successful', 'booking': booking.serialize()}, 201


        def get(self, booking_id=None):
            default_user = User.query.filter_by(username='testuser').first()
            if booking_id:
                booking = Booking.query.get_or_404(booking_id)
                # Ensure the booking belongs to the default user
                if booking.user_id != default_user.id:
                    return {'message': 'Unauthorized'}, 403
                return {'booking': booking.serialize()}
            else:
                # Fetch all bookings for the default user
                bookings = Booking.query.filter_by(user_id=default_user.id).all()
                return {'bookings': [booking.serialize() for booking in bookings]}

        def delete(self, booking_id):
            default_user = User.query.filter_by(username='testuser').first()            
            booking = Booking.query.get_or_404(booking_id)

            # Ensure the booking belongs to the default user
            if booking.user_id != default_user.id:
                return {'message': 'Unauthorized'}, 403

            booking.status = 'cancelled'
            db.session.commit()

            return {'message': 'Booking cancelled successfully'}, 200


    api.add_resource(TheatreResource, '/theatres', '/theatres/<int:theatre_id>')
    api.add_resource(ShowResource, '/shows', '/shows/<int:show_id>')
    api.add_resource(ShowtimeResource, '/showtimes', '/showtimes/<int:showtime_id>')
    api.add_resource(BookingResource, '/bookings', '/bookings/<int:booking_id>')    