import { getShow, getAllShowtimes } from '../api.js';

const ShowDetails = {
  template: `
  <div class="container mt-5">
    <div class="show-details-card">
      <h1 class="text-center mb-4">Show Details</h1>
      <div class="show-content">
        <h2 class="show-name">{{ show.name }}</h2>
        <p class="show-rating"><strong>Rating:</strong> {{ show.rating }}</p>
        <p class="show-genre"><strong>Genre:</strong> {{ show.tags }}</p>
        <div v-if="showtimes.length">
          <button class="btn btn-primary" @click="goToBooking">Go to Booking</button>
        </div>
        <div v-else>
          <p class="show-not-screened">This show is currently not being screened :( Please check later.</p>
        </div>
      </div>
    </div>
  </div>
  `,

  data: function() {
    return {
      show: {},
      showtimes: []
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
      } catch (error) {
        console.error("Error fetching showtimes for show:", error);
      }
    },

    goToBooking() {
        this.$router.push({ name: 'BookTickets', params: { showId: this.show.id } });
    }      
  }
};

export default ShowDetails;
