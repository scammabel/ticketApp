import { registerUser } from '../api.js';

const Register = {
  template: `<div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required class="form-control" id="email">
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" required class="form-control" id="password">
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
      <button @click="goToLogin" class="btn btn-secondary">Already have an account? Login</button>
    </form>
  </div>`,

  data: function() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        await registerUser(this.email, this.password);
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration failed:', error.message);
      }
    },
    goToLogin() {
        this.$router.push('/login');
    }
  },
};

export default Register;
