import { getTheatres, createTheatre, editTheatre, deleteTheatre } from '../api.js';

const ManageTheatres = {
  template: `
  <div>
    <h1>Manage Theatres</h1>
    
    <!-- Add New Theatre Button -->
    <button class="btn btn-success mb-3" @click="AddMethod">Add New Theatre</button>

    <!-- Theatres Table -->
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Place</th>
          <th>Capacity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="theatre in theatres" :key="theatre.id">
          <td>{{ theatre.name }}</td>
          <td>{{ theatre.place }}</td>
          <td>{{ theatre.capacity }}</td>
          <td>
            <button class="btn btn-warning btn-sm mr-2" @click="openEditModal(theatre)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="openDeleteModal(theatre.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Overlay -->
    <div v-if="showAddModal" class="overlay" @click="showAddModal = false"></div>

    <!-- Slide-in Panel for Add Theatre -->
    <div v-if="showAddModal" class="slide-in-panel">
      <h5>Add New Theatre</h5>
      <input v-model="newTheatre.name" placeholder="Theatre Name" class="form-control mb-2">
      <input v-model="newTheatre.place" placeholder="Place" class="form-control mb-2">
      <input v-model="newTheatre.capacity" placeholder="Capacity" class="form-control mb-2">
      <button class="btn btn-secondary" @click="showAddModal = false">Close</button>
      <button class="btn btn-primary" @click="addTheatre">Add Theatre</button>
    </div>

    <!-- Slide-in Panel for Edit Theatre -->
    <div v-if="showEditModal" class="slide-in-panel">
      <h5>Edit Theatre</h5>
      <input v-model="editingTheatre.name" placeholder="Theatre Name" class="form-control mb-2">
      <input v-model="editingTheatre.place" placeholder="Place" class="form-control mb-2">
      <input v-model="editingTheatre.capacity" placeholder="Capacity" class="form-control mb-2">
      <button class="btn btn-secondary" @click="showEditModal = false">Close</button>
      <button class="btn btn-primary" @click="updateTheatre">Save Changes</button>
    </div>

    <!-- Slide-in Panel for Delete Theatre -->
    <div v-if="showDeleteModal" class="slide-in-panel">
      <h5>Delete Theatre</h5>
      <p>Are you sure you want to delete this theatre?</p>
      <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
      <button class="btn btn-danger" @click="deleteTheatre">Delete</button>
    </div>
  </div>
`,

  data: function() {
    return {
      theatres: [],
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showTestModal: false,
      deletingTheatreId: null,
      newTheatre: {
        name: '',
        place: '',
        capacity: ''
      },
      editingTheatre: {
        id: null,
        name: '',
        place: '',
        capacity: ''
      }
    };
  },
  created() {
    this.fetchTheatres();
  },
  methods: {

    AddMethod() {
      this.showAddModal = true;
    },

    async fetchTheatres() {
      try {
        let response = await getTheatres();
        this.theatres = response.theatres || [];
      } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    },
    async addTheatre() {
      console.log("addTheatre method triggered");
      try {
        await createTheatre(this.newTheatre.name, this.newTheatre.place, this.newTheatre.capacity);
        this.fetchTheatres();
        this.showAddModal = false;
        this.newTheatre = { name: '', place: '', capacity: '' }; 
      } catch (error) {
        console.error("Error adding theatre:", error);
      }
    },

    openEditModal(theatre) {
      this.editingTheatre.id = theatre.id;
      this.editingTheatre.name = theatre.name;
      this.editingTheatre.place = theatre.place;
      this.editingTheatre.capacity = theatre.capacity;
      this.showEditModal = true;
    },

    async updateTheatre() {
      try {
        await editTheatre(this.editingTheatre.id, {
          name: this.editingTheatre.name,
          place: this.editingTheatre.place,
          capacity: this.editingTheatre.capacity
        });
        this.fetchTheatres();
        this.showEditModal = false;
        this.editingTheatre = { id: null, name: '', place: '', capacity: '' }; 
      } catch (error) {
        console.error("Error updating theatre:", error);
      }
    },

    openDeleteModal(theatreId) {
      this.deletingTheatreId = theatreId;
      this.showDeleteModal = true;
    },

    async deleteTheatre() {
      try {
        await deleteTheatre(this.deletingTheatreId);
        this.fetchTheatres();
        this.showDeleteModal = false;
        this.deletingTheatreId = null; // Reset
      } catch (error) {
        console.error("Error deleting theatre:", error);
      }
    }
  },
};

export default ManageTheatres;


