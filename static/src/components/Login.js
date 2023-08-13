
import { loginUser } from '../api.js';

const Login = {
  template: `<div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required class="form-control" id="email">
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" required class="form-control" id="password">
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>`,


  data: function() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
        try {
          const user = await loginUser(this.email, this.password);
          //Remove or comment out the following lines:
          this.$router.push('/');
        } catch (error) {
          console.error('Login failed:', error.message);
        }
      }
  },
};

export default Login;