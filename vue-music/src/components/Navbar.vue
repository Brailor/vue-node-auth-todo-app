<template>
    <b-navbar toggleable type="default navbar-fixed-top">

    <b-nav-toggle target="nav_collapse"></b-nav-toggle>

      <router-link class="navbar-brand" to="/">Vue App</router-link>

    <b-collapse is-nav id="nav_collapse">
      <b-nav is-nav-bar class="ml-auto">
          <b-nav>
           <li v-if="!isLoggedIn"><router-link to="/login">Belépés</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/register">Regisztráció</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/create">Todo írás</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/profil">Profil</router-link></li>
            <li v-if="isLoggedIn" @click="logout"><router-link to="">Kijelentkezés</router-link></li>
          </b-nav>
      </b-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import AuthServce from '../services/AuthService.js';
const auth = new AuthServce();

export default {
  props:['isLoggedIn'],
  data() {
    return {
    }
  },
  methods:{
    logout(){
      this.$swal('Kijelentkeztél!', '', 'success')
      .then(() => {
        auth.logoutUser();
      })

    }
  }
}

</script>

<style scoped>


</style>
