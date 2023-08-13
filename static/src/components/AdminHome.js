const AdminHome = {
  template: `
      <div class="admin-dashboard text-center">
      <h1>Admin Dashboard</h1>
      <div class="buttons mt-4">
        <button class="btn btn-primary btn-lg mr-2" @click="navigateTo('ManageTheatres')">Manage Theatres</button>
        <button class="btn btn-primary btn-lg mr-2" @click="navigateTo('ManageShows')">Manage Shows</button>
        <button class="btn btn-primary btn-lg" @click="navigateTo('AddShow')">Add Showtime</button>
      </div>
    </div>
  `,
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    }
  }
};

export default AdminHome;
