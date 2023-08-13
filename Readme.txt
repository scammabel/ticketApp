1. Users Table

    ID: Primary Key, unique identifier for each user.
    Username: User's login name.
    Password: Hashed password for authentication.
    Role: Role of the user (e.g., 'admin' or 'user').
    Email: (Optional) User's email address.

2. Theatres Table

    ID: Primary Key, unique identifier for each theatre.
    Name: Name of the theatre.
    Place: Location of the theatre.
    Capacity: Seating capacity of the theatre.

3. Shows Table

    ID: Primary Key, unique identifier for each show.
    Name: Name of the show (movie).
    Rating: Rating of the show.
    Tags: Tags associated with the show (e.g., genre).
    TicketPrice: Price of a single ticket.

4. Showtimes Table

    ID: Primary Key, unique identifier for each showtime.
    ShowID: Foreign Key, references the ID in the Shows table.
    TheatreID: Foreign Key, references the ID in the Theatres table.
    StartTime: The start time of the show.
    EndTime: The end time of the show.

5. Bookings Table

    ID: Primary Key, unique identifier for each booking.
    UserID: Foreign Key, references the ID in the Users table to associate a booking with a specific user.
    ShowtimeID: Foreign Key, references the ID in the Showtimes table to associate a booking with a specific showtime.
    NumberOfTickets: Number of tickets booked.
    BookingTime: Timestamp of when the booking was made.
    Status: Status of the booking (e.g., 'confirmed', 'cancelled').

Relationships

    One-to-Many between Theatres and Showtimes: A theatre can host multiple showtimes, but each showtime is associated with one theatre.
    One-to-Many between Shows and Showtimes: A show can have multiple showtimes, but each showtime is associated with one show.
    One-to-Many between Users and Bookings: A user can make multiple bookings, but each booking is associated with one user.
    One-to-Many between Showtimes and Bookings: A showtime can have multiple bookings, but each booking is associated with one showtime.
