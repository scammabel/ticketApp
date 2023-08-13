<!-- Landing.vue -->
<template>
    <div class="landing-container">
      <h1>Welcome to Tapp!</h1>
      <p>The one stop ticket app</p>
      <button @click="goToLogin">Login</button>
      <button @click="goToSignup">Sign Up</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Landing',
    methods: {
      goToLogin() {
        this.$router.push('/login');
      },
      goToSignup() {
        this.$router.push('/signup');
      },
    },
  };
  </script>
  
  <style scoped>
  .landing-container {
    text-align: center;
    padding: 20px;
  }
  
  button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  