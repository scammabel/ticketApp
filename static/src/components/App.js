const App = {
  template: `
  <div>
        <!-- Static Header -->
        <nav class="navbar navbar-dark bg-primary">
            <a class="navbar-brand" href="#">Tapp!</a>
            <button class="btn btn-light" @click="logout">Logout</button>
        </nav>
        
        <!-- Main Content -->
        <div class="container mt-4">
            <router-view></router-view>
        </div>
    </div>
  `,
  methods: {
    
    logout() {
      // Placeholder for logout functionality
      console.log("Logged out!");
    }
  }
};

export default App;