import { getTheatres, exportTheatreToCSV } from '../api.js';

const AdminHome = {
  template: `
    <div class="admin-dashboard text-center">
      <h1>Admin Dashboard</h1>
      <div class="buttons mt-4">
        <button class="btn btn-primary btn-lg mr-2" @click="navigateTo('ManageTheatres')">Manage Theatres</button>
        <button class="btn btn-primary btn-lg mr-2" @click="navigateTo('ManageShows')">Manage Shows</button>
        <button class="btn btn-primary btn-lg" @click="navigateTo('AddShow')">Add Showtime</button>
      </div>
      <div class="theatre-selection mt-4">
        <select v-model="selectedTheatre">
          <option v-for="theatre in theatres" :value="theatre.id">{{ theatre.name }}</option>
        </select>
        <button class="btn btn-primary btn-sm" @click="exportTheatreData">Export to CSV</button>
      </div>
      <!-- rest of your template -->
    </div>
  `,
  data: function() {
    return {
      theatres: [],  // This will store the list of theatres fetched from the backend
      selectedTheatre: null  // This will store the ID of the selected theatre
    }
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    async exportTheatreData() {
      if (this.selectedTheatre) {
        try {
          let response = await exportTheatreToCSV(this.selectedTheatre);
          alert("Export process started. You will be notified once it's done.");
        } catch (error) {
          console.error("Error exporting theatre data:", error);
          alert(error.message);
        }
      } else {
        alert("Please select a theatre to export.");
      }
    },

    async fetchTheatres() {
      try {
        let response = await getTheatres();  // getTheatres() should be a method from your API helpers, which returns the theatres.
        this.theatres = response.theatres || [];
      } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    }
  },
  async created() {
    this.fetchTheatres();
  }
};
export default AdminHome;