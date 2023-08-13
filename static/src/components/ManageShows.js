import { getShows, createShow, editShow, deleteShow } from '../api.js';

const ManageShows = {
  template: `
  <div>
    <h1>Manage Shows</h1>

    <!-- Add New Show Button -->
    <button class="btn btn-success mb-3" @click="showAddModal = true">Add New Show</button>
    
    <!-- Shows Table -->
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Rating</th>
          <th>Tags</th>
          <th>Ticket Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="show in shows" :key="show.id">
          <td>{{ show.name }}</td>
          <td>{{ show.rating }}</td>
          <td>{{ show.tags }}</td>
          <td>{{ show.ticket_price }}</td>
          <td>
            <button class="btn btn-warning btn-sm mr-2" @click="openEditModal(show)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="openDeleteModal(show.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Overlay -->
    <div v-if="showAddModal || showEditModal || showDeleteModal" class="overlay" @click="closeAllModals"></div>
    
    <!-- Slide-in Panel for Add Show -->
    <div v-if="showAddModal" class="slide-in-panel">
      <h5>Add New Show</h5>
      <input v-model="newShow.name" placeholder="Show Name" class="form-control mb-2">
      <input v-model="newShow.rating" placeholder="Rating" type="number" step="0.1" class="form-control mb-2">
      <input v-model="newShow.tags" placeholder="Tags (comma separated)" class="form-control mb-2">
      <input v-model="newShow.ticket_price" placeholder="Ticket Price" type="number" step="0.1" class="form-control mb-2">
      <button class="btn btn-secondary" @click="showAddModal = false">Close</button>
      <button class="btn btn-primary" @click="addShow">Add Show</button>
    </div>
    
    <!-- Slide-in Panel for Edit Show -->
    <div v-if="showEditModal" class="slide-in-panel">
      <h5>Edit Show</h5>
      <input v-model="editingShow.name" placeholder="Show Name" class="form-control mb-2">
      <input v-model="editingShow.rating" placeholder="Rating" type="number" step="0.1" class="form-control mb-2">
      <input v-model="editingShow.tags" placeholder="Tags (comma separated)" class="form-control mb-2">
      <input v-model="editingShow.ticket_price" placeholder="Ticket Price" type="number" step="0.1" class="form-control mb-2">
      <button class="btn btn-secondary" @click="showEditModal = false">Close</button>
      <button class="btn btn-primary" @click="updateShow">Save Changes</button>
    </div>
    
    <!-- Slide-in Panel for Delete Show -->
    <div v-if="showDeleteModal" class="slide-in-panel">
      <h5>Delete Show</h5>
      <p>Are you sure you want to delete this show?</p>
      <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
      <button class="btn btn-danger" @click="deleteShow">Delete</button>
    </div>
  </div>
  `,

  data: function() {
    return {
      shows: [],
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      newShow: {
        name: '',
        rating: '',
        tags: '',
        ticket_price: ''
      },
      editingShow: {
        id: null,
        name: '',
        rating: '',
        tags: '',
        ticket_price: ''
      },
      deletingShowId: null
    };
  },
  created() {
    this.fetchShows();
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
        
    async addShow() {
      console.log("addShow method triggered");
      try {
        await createShow(this.newShow);
        this.fetchShows();
        this.showAddModal = false;
        this.newShow = { name: '', rating: '', tags: '', ticket_price: '' }; // Reset form
      } catch (error) {
        console.error("Error adding show:", error.message || JSON.stringify(error));
      }
    },

    closeAllModals() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.showDeleteModal = false;
    },

    openEditModal(show) {
      this.editingShow.id = show.id;
      this.editingShow.name = show.name;
      this.editingShow.rating = show.rating;
      this.editingShow.tags = show.tags;
      this.editingShow.ticket_price = show.ticket_price;
      this.showEditModal = true;
    },
    async updateShow() {
      try {
        await editShow(this.editingShow.id, this.editingShow);
        this.fetchShows();
        this.showEditModal = false;
        this.editingShow = { id: null, name: '', rating: '', tags: '', ticket_price: '' }; // Reset form
      } catch (error) {
        console.error("Error updating show:", error);
      }
    },
    openDeleteModal(showId) {
      this.deletingShowId = showId;
      this.showDeleteModal = true;
    },
    async deleteShow() {
      try {
        await deleteShow(this.deletingShowId);
        this.fetchShows();
        this.showDeleteModal = false;
        this.deletingShowId = null; // Reset
      } catch (error) {
        console.error("Error deleting show:", error);
      }
    }
  },
};

export default ManageShows;