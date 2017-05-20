<template>
  <div id="app">
    <app-navbar v-bind:isLoggedIn="isLoggedIn"></app-navbar>
    <div class="container">
      <div class="row">
        <div class="col-md-10 col-md-offset-1">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import AuthService from './services/AuthService.js';
const auth = new AuthService();
export default {

  data () {
    return {
      isLoggedIn: false
    }
  },
  components: {
    'app-navbar': Navbar
  },
  updated() {
     this.isLoggedIn = auth.isLoggedIn();
  },
  created() {
    this.isLoggedIn = auth.isLoggedIn();
  }
}
</script>

<style>
body{
  margin-top: 100px;
}
</style>
