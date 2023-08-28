import { getUserBookings, cancelBooking, getShow, getShowtime, getAllShows, getTheatres } from '../api.js';

const Bookings = {
  template: `
  <div class="container">
    <h1>My Bookings</h1>
    
    <!-- Bookings Table -->
    <table class="table">
      <thead>
        <tr>
          <th>Show Name</th>
          <th>Theatre</th>
          <th>Number of Tickets</th>
          <th>Showtime</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.id">
          <td>{{ booking.show.name }}</td>
          <td>{{ booking.showtime.theatre_name }}</td>
          <td>{{ booking.number_of_tickets }}</td>
          <td>{{ booking.showtime.start_time }} - {{ booking.showtime.end_time }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="cancelUserBooking(booking.id)">Cancel</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `,

  data: function() {
    return {
      bookings: []
    };
  },

  async created() {
    try {
        const response = await getUserBookings();
        console.log("Initial Bookings:", response.bookings); // Log the initial bookings

        // Fetch all shows and create a map for quick lookup
        const allShowsResponse = await getAllShows();
        const allShows = allShowsResponse.shows;
        const showNameMap = {};
        allShows.forEach(show => {
            showNameMap[show.id] = show.name;
        });

        // Fetch all theatres and create a map for quick lookup
        const allTheatresResponse = await getTheatres();
        const allTheatres = allTheatresResponse.theatres;
        const theatreNameMap = {};
        allTheatres.forEach(theatre => {
            theatreNameMap[theatre.id] = theatre.name;
        });

        // Populate show_name and theatre_name for each booking
        const bookingsData = response.bookings.map(booking => {
            if (booking.showtime) {
                booking.show = {
                    name: showNameMap[booking.showtime.show_id]
                };
                booking.showtime.theatre_name = theatreNameMap[booking.showtime.theatre_id];
            }
            return booking;
        });

        this.bookings = bookingsData;
        console.log("Final Bookings Data:", this.bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
    }
  },

  

  methods: {
    async fetchUserBookings() {
        try {
          const response = await getUserBookings();
          const bookingsData = await Promise.all(response.bookings.map(async booking => {
            // Check if show_id exists in the booking object
            if (booking.showtime && booking.showtime.show_id) {
                const show = await getShow(booking.showtime.show_id);
                booking.show = show.show; // Access the nested show property                
              const showtime = await getShowtime(booking.showtime_id);
              return {
                ...booking,
                show: show,
                showtime: showtime
              };
            } else {
              console.warn("Booking object does not have show_id:", booking);
              return booking; // Return the original booking if show_id is not present
            }
          }));
          this.bookings = bookingsData;
        } catch (error) {
          console.error("Error fetching user bookings:", error);
        }
      },


    async cancelUserBooking(bookingId) {
      try {
        await cancelBooking(bookingId);
        alert('Booking cancelled successfully!');
        this.bookings = this.bookings.filter(booking => booking.id !== bookingId); // Remove the cancelled booking from the list
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  }
};

export default Bookings;
