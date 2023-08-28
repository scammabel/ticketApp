from flask import Flask, request, render_template
from flask_restful import Api, Resource, reqparse
from flask_security import login_required, login_user, logout_user, verify_password, current_user
from flask_caching import Cache
from flask_mail import Mail, Message
from sqlalchemy import extract

from .models import db, Theatre, Show, Showtime, Booking, User, Role, roles_users
from .celery_config import celery

from datetime import datetime, date, timedelta
import uuid

cache = Cache(config={'CACHE_TYPE': 'simple'})          #For Redis Caching

def register_routes(app, user_datastore):

    api = Api(app)                                      #initializing objects
    cache.init_app(app)
    mail = Mail(app)

    @app.route('/')
    def index():
        return render_template('index.html')            #entry point for frontend

    class TheatreResource(Resource):                    #For Theater related operations

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

            Showtime.query.filter_by(theatre_id=theatre_id).delete()

            db.session.delete(theatre)
            db.session.commit()

            return {'message': 'Theatre deleted successfully'}, 200
        
        @cache.memoize(50)
        def get(self, theatre_id=None):
            if theatre_id:
                theatre = Theatre.query.get_or_404(theatre_id)
                return {'theatre': theatre.serialize()}
            else:
                theatres = Theatre.query.all()
                return {'theatres': [theatre.serialize() for theatre in theatres]}

    
    class ShowResource(Resource):                       #For Show related operations
        
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
        
        @cache.memoize(50)
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

    class ShowtimeResource(Resource):                   #For showtime related operations
        
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
        
        @cache.memoize(50)
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


    class BookingResource(Resource):                       #For Bookings related operations
        def post(self):
            parser = reqparse.RequestParser()
            parser.add_argument('showtime_id', type=int, required=True, help="Showtime ID cannot be blank!")
            parser.add_argument('number_of_tickets', type=int, required=True, help="Number of tickets cannot be blank!")
            
            args = parser.parse_args()

            # Check availability considering existing bookings
            showtime = Showtime.query.get_or_404(args['showtime_id'])
            existing_tickets = sum(booking.number_of_tickets for booking in showtime.bookings if booking.status != 'cancelled')
            if showtime.theatre.capacity - existing_tickets < args['number_of_tickets']:
                return {'message': 'Not enough tickets available'}, 400

            booking = Booking(user_id=current_user.id, showtime_id=args['showtime_id'], number_of_tickets=args['number_of_tickets'], booking_time=datetime.now(), status='confirmed')
            db.session.add(booking)
            db.session.commit()

            return {'message': 'Booking successful', 'booking': booking.serialize()}, 201

        def get(self, booking_id=None):
            if booking_id:
                booking = Booking.query.get_or_404(booking_id)
                if booking.user_id != current_user.id:
                    return {'message': 'Unauthorized'}, 403
                return {'booking': booking.serialize()}
            else:
                # Fetch all bookings for the logged-in user
                bookings = Booking.query.filter_by(user_id=current_user.id).filter(Booking.status != 'cancelled').all()
                return {'bookings': [booking.serialize() for booking in bookings]}

        def delete(self, booking_id):          
            booking = Booking.query.get_or_404(booking_id)

            if booking.user_id != current_user.id:
                return {'message': 'Unauthorized'}, 403

            booking.status = 'cancelled'
            db.session.commit()

            return {'message': 'Booking cancelled successfully'}, 200
        


    class UserRegistrationResource(Resource):           #For the User Registration using Flask-Security
        def post(self):
            parser = reqparse.RequestParser()
            parser.add_argument('email', required=True, help="Email cannot be blank!")
            parser.add_argument('password', required=True, help="Password cannot be blank!")
            
            args = parser.parse_args()
            
            existing_user = User.query.filter_by(email=args['email']).first()
            if existing_user:
                return {'message': 'A user with that email already exists'}, 400
            
            # Extract the username from the email
            username = args['email'].split('@')[0]
            
            fs_uniquifier = str(uuid.uuid4())
            
            user = User(username=username, email=args['email'], password=args['password'], fs_uniquifier=fs_uniquifier)

            default_role = Role.query.filter_by(name='user').first()
            if default_role:
                user.roles.append(default_role)
            else:
                return {'message': 'Default role not found. Please ensure roles are set up correctly.'}, 500


            db.session.add(user)
            db.session.commit()

            return {'message': 'User registered successfully'}, 201




    class UserLoginResource(Resource):                  #For the User login using Flask-Security
        def post(self):
            parser = reqparse.RequestParser()
            parser.add_argument('email', required=True, help="Email cannot be blank!")
            parser.add_argument('password', required=True, help="Password cannot be blank!")
                
            args = parser.parse_args()
                
                # Authenticate user using Flask-Security
            user = user_datastore.find_user(email=args['email'])
            if user and verify_password(args['password'], user.password):
                login_user(user)
                return {'message': 'Logged in successfully'}, 200
            else:
                return {'message': 'Invalid email or password'}, 401

 
    class UserLogoutResource(Resource):                  #For User Logout Funtionality
        @login_required
        def post(self):
            logout_user()
            return {'message': 'Logged out successfully'}, 200

    class CurrentUserResource(Resource):
        @login_required
        def get(self):
            user = current_user
            return {
                'id': user.id,
                'email': user.email,
                'roles': [role.name for role in user.roles]
            }
                    # Celery Jobs functions
    @celery.task
    def send_daily_reminders():
        with app.app_context():
            users = User.query.join(roles_users).join(Role).filter(Role.name == 'user').all()
            one_day_ago = datetime.now() - timedelta(days=1)

            for user in users:
                recent_booking = Booking.query.filter_by(user_id=user.id).filter(Booking.booking_time > one_day_ago).first()

                if not recent_booking:
                    msg = Message("Reminder: Book a Show!", recipients=[user.email])
                    msg.body = "Hello! Please visit our platform and book a show."
                    mail.send(msg)

    @celery.task
    def send_monthly_report():
        with app.app_context():
            users = User.query.all()
            current_month = datetime.now().month
            last_month = current_month - 1 if current_month != 1 else 12

            for user in users:
                bookings = Booking.query.filter_by(user_id=user.id).filter(
                    extract('month', Booking.booking_time) == last_month).all()

                booking_details = "\n".join([f"Show: {booking.showtime.show.name}, Date: {booking.booking_time.date()}" for booking in bookings])
                
                msg = Message("Your Monthly Booking Report", recipients=[user.email])
                msg.body = f"Hello {user.email}!\nHere's your monthly report:\n{booking_details}"
                mail.send(msg)

    @celery.task(name='export_theatre_to_csv_task')
    def export_theatre_to_csv(theatre_id):
        with app.app_context():

            shows = db.session.query(Show).join(Showtime).filter(Showtime.theatre_id == theatre_id).all()
            
            # Convert shows to CSV format
            csv_data = "Show ID, Show Name, Rating\n"
            for show in shows:
                csv_data += f"{show.id}, {show.name}, {show.rating}\n"
            
            # Save the CSV to a file
            filename = f"theatre_{theatre_id}_export.csv"
            with open(filename, 'w') as f:
                f.write(csv_data)

            # Notify the admin (or user) that the export is done
            print(f"Export completed for theatre {theatre_id}! File: {filename}")


    class ExportTheatreCSV(Resource):
        def get(self, theatre_id):
            app.logger.info(f"Invoking export_theatre_to_csv with theatre_id: {theatre_id}")
            # Trigger the Celery task to export data for the given theatre_id
            celery.send_task('export_theatre_to_csv_task', args=[theatre_id])
            return {"message": "Export process started."}



    api.add_resource(ExportTheatreCSV, '/export/theatre/<int:theatre_id>/csv')
    api.add_resource(TheatreResource, '/theatres', '/theatres/<int:theatre_id>')
    api.add_resource(ShowResource, '/shows', '/shows/<int:show_id>')
    api.add_resource(ShowtimeResource, '/showtimes', '/showtimes/<int:showtime_id>')
    api.add_resource(BookingResource, '/bookings', '/bookings/<int:booking_id>')
    api.add_resource(UserLoginResource, '/login')    
    api.add_resource(CurrentUserResource, '/current_user')
    api.add_resource(UserLogoutResource, '/logout')
    api.add_resource(UserRegistrationResource, '/register')