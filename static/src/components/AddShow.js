import { getAllShowtimes, createShowtime, deleteShowtime, getShows, getTheatres } from '../api.js';


const AddShowtime = {
  template: `
  <div>
    <h1>Add Showtime</h1>
    
    <!-- Add New Showtime Button -->
    <button class="btn btn-success mb-3" @click="showAddModal = true">Add New Showtime</button>

    <!-- Showtimes Table -->
    <table class="table">
      <thead>
        <tr>
          <th>Show</th>
          <th>Theatre</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="showtime in showtimes" :key="showtime.id">
          <td>{{ showLookup[showtime.show_id] }}</td>
          <td>{{ theatreLookup[showtime.theatre_id] }}</td>
          <td>{{ showtime.start_time }}</td>
          <td>{{ showtime.end_time }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="openDeleteModal(showtime.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Overlay -->
    <div v-if="showAddModal || showDeleteModal" class="overlay" @click="closeAllModals"></div>

    <!-- Slide-in Panel for Add Showtime -->
    <div v-if="showAddModal" class="slide-in-panel">
      <h5>Add New Showtime</h5>
      <!-- Assuming you have a list of shows and theatres to select from -->
      <select v-model="newShowtime.show_id">
        <option v-for="show in shows" :value="show.id">{{ show.name }}</option>
      </select>
      <select v-model="newShowtime.theatre_id">
        <option v-for="theatre in theatres" :value="theatre.id">{{ theatre.name }}</option>
      </select>
      
      <input type="datetime-local" v-model="newShowtime.start_time" class="form-control mb-2">
      <input type="datetime-local" v-model="newShowtime.end_time" class="form-control mb-2">

      <button class="btn btn-secondary" @click="showAddModal = false">Close</button>
      <button class="btn btn-primary" @click="addShowtime">Add Showtime</button>
    </div>

    <!-- Slide-in Panel for Delete Showtime -->
    <div v-if="showDeleteModal" class="slide-in-panel">
      <h5>Delete Showtime</h5>
      <p>Are you sure you want to delete this showtime?</p>
      <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
      <button class="btn btn-danger" @click="deleteShowtime">Delete</button>
    </div>
  </div>
`,

  data: function() {
    return {
      showtimes: [],
      shows: [], 
      theatres: [], 
      showAddModal: false,
      showDeleteModal: false,
      newShowtime: {
        show_id: null,
        theatre_id: null,
        start_time: '',
        end_time: ''
      },
      deletingShowtimeId: null
    };
  },
  computed: {
    showLookup() {
      const lookup = {};
      this.shows.forEach(show => {
        lookup[show.id] = show.name;
      });
      return lookup;
    },
    theatreLookup() {
      const lookup = {};
      this.theatres.forEach(theatre => {
        lookup[theatre.id] = theatre.name;
      });
      return lookup;
    }
  },
  created() {
    this.fetchTheatres();
    this.fetchShows();
    this.fetchShowtimes();
  },
  methods: {
    async fetchShows() {
      try {
        let response = await getShows();
        this.shows = response.shows || [];
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    },
    async fetchTheatres() {
      try {
        let response = await getTheatres();
        this.theatres = response.theatres || [];
      } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    },
    async fetchShowtimes() {
      try {
          let response = await getAllShowtimes();
          console.log("Server Response:", response);
          this.showtimes = response || [];
          console.log("Assigned Showtimes:", this.showtimes);

      } catch (error) {
          console.error("Error fetching showtimes:", error);
      }
     },
    async addShowtime() {
      try {
        this.newShowtime.start_time += ":00";
        this.newShowtime.end_time += ":00";

        await createShowtime(this.newShowtime); 
        this.fetchShowtimes();
        this.showAddModal = false;
        this.newShowtime = { show_id: null, theatre_id: null, start_time: '', end_time: '' };
      } catch (error) {
        console.error("Error adding showtime:", error);
      }
    },
    closeAllModals() {
      this.showAddModal = false;
      this.showDeleteModal = false;
    },
    openDeleteModal(showtimeId) {
      this.deletingShowtimeId = showtimeId;
      this.showDeleteModal = true;
    },
    async deleteShowtime() {
      try {
        await deleteShowtime(this.deletingShowtimeId); 
        this.fetchShowtimes();
        this.showDeleteModal = false;
        this.deletingShowtimeId = null; // Reset
      } catch (error) {
        console.error("Error deleting showtime:", error);
      }
    }
  },
};

export default AddShowtime;
