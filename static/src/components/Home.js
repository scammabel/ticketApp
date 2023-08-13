import { getShows } from '../api.js';

const Home = {
  template: `
  <div class="container">
    <h1>User Dashboard</h1>
    
    <!-- Search Bar -->
    <div class="search-bar mb-3">
      <input v-model="searchTerm" placeholder="Search for shows..." class="form-control mr-3">
      <button class="btn btn-primary" @click="searchShows">Search Shows</button>
    </div>
    
    <!-- Action Buttons -->
    <div class="home-actions mb-3">
      <button class="btn btn-secondary" @click="viewBookings">My Bookings</button>
    </div>

    <!-- Top Rated Shows -->
    <div class="top-rated-shows">
      <div 
        v-for="show in topRatedShows" 
        :key="show.id" 
        class="show-card mb-3" 
        @click="viewShowDetails(show.id)"
      >
        <h2 class="show-title">{{ show.name }}</h2>
        <p><strong>Rating:</strong> {{ show.rating }}</p>
        <p><strong>Tags:</strong> {{ show.tags }}</p>
      </div>
    </div>
  </div>
  `,

  data: function() {
    return {
      searchTerm: '',
      topRatedShows: []
    };
  },

  created() {
    this.fetchTopRatedShows();
  },

  methods: {
    async fetchTopRatedShows() {
      try {
        const response = await getShows();
        this.topRatedShows = response.shows || [];
        this.topRatedShows.sort((a, b) => b.rating - a.rating); // Sort by rating in descending order
        this.topRatedShows = this.topRatedShows.slice(0, 4); // Get top 4 rated shows
      } catch (error) {
        console.error("Error fetching top rated shows:", error);
      }
    },

    async searchShows() {
      try {
        const response = await getShows(this.searchTerm);
        this.topRatedShows = response.shows || [];
      } catch (error) {
        console.error("Error searching for shows:", error);
      }
    },

    viewBookings() {
        this.$router.push({ name: 'Bookings' });
    },

    viewShowDetails(showId) {
        this.$router.push({ name: 'ShowDetails', params: { showId: showId } });
    }  
  }
};

export default Home;
