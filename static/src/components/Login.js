import { loginUser} from '../api.js';

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
      <button @click="goToRegister" class="btn btn-secondary">Don't have an account? Register</button>
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
        this.$router.push('/');
      } catch (error) {
        const errorMessage = error && error.response && error.response.data && error.response.data.message 
                             ? error.response.data.message 
                             : 'Login failed! Please make sure you have an account and the credentials are correct ';
        alert(errorMessage);
        console.error('Login failed:', error.message);
      }
    },
    goToRegister() {
        this.$router.push('/register');
    }
  },
};

export default Login;