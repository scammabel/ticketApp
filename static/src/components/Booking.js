// BookTickets.js
import { getShow, getAllShowtimes, bookTickets, getTheatres } from '../api.js';

const BookTickets = {
  template: `
  <div class="container mt-5">
    <div class="show-details-card">
      <h1 class="text-center mb-4">Book Tickets</h1>
      <div class="show-content">
        <h2 class="show-name">{{ show.name }}</h2>
        <div class="mb-3">
          <label for="theatre" class="form-label">Select Theatre:</label>
          <select v-model="selectedTheatre" @change="filterShowtimes" class="form-select">
            <option v-for="theatre in theatres" :value="theatre.id">{{ theatre.name }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="showtime" class="form-label">Select Showtime:</label>
          <select v-model="selectedShowtime" class="form-select">
            <option v-for="showtime in filteredShowtimes" :value="showtime.id">{{ showtime.start_time }} - {{ showtime.end_time }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="tickets" class="form-label">Number of Tickets:</label>
          <input type="number" v-model="numberOfTickets" min="1" class="form-control" />
        </div>
        <button class="btn btn-primary" @click="makeBooking">Book</button>
      </div>
    </div>
  </div>
  `,

  data: function() {
    return {
      show: {},
      theatres: [],
      showtimes: [],
      filteredShowtimes: [],
      selectedTheatre: null,
      selectedShowtime: null,
      numberOfTickets: 1
    };
  },

  created() {
    this.fetchShowDetails();
    this.fetchShowtimesForShow();
  },

  methods: {
    async fetchShowDetails() {
      try {
        const showId = this.$route.params.showId;
        const response = await getShow(showId);
        this.show = response.show;
      } catch (error) {
        console.error("Error fetching show details:", error);
      }
    },

    async fetchShowtimesForShow() {
        try {
            const allShowtimes = await getAllShowtimes();
            this.showtimes = allShowtimes.filter(showtime => showtime.show_id === this.show.id);
    
            // Fetch all theatres
            const allTheatres = await getTheatres();
            const theatreList = allTheatres.theatres;
    
            // Create a map of theatre_id to theatre_name for quick lookup
            const theatreNameMap = {};
            theatreList.forEach(theatre => {
                theatreNameMap[theatre.id] = theatre.name;
            });
    
            // Add theatre_name to each showtime
            this.showtimes.forEach(showtime => {
                showtime.theatre_name = theatreNameMap[showtime.theatre_id];
            });
    
            // Create a unique list of theatres
            const theatreSet = new Set();
            this.showtimes.forEach(showtime => {
                theatreSet.add(JSON.stringify({ id: showtime.theatre_id, name: showtime.theatre_name }));
            });
            this.theatres = Array.from(theatreSet).map(item => JSON.parse(item));
    
        } catch (error) {
            console.error("Error fetching showtimes for show:", error);
        }
    },

    filterShowtimes() {
      this.filteredShowtimes = this.showtimes.filter(showtime => showtime.theatre_id === this.selectedTheatre);
    },

    async makeBooking() {
      try {
        await bookTickets(this.selectedShowtime, this.numberOfTickets);
        alert('Booking successful!');
      } catch (error) {
        console.error("Error making booking:", error);
        alert('Booking failed. Please try again.');
      }
    }
  }
};

export default BookTickets;
