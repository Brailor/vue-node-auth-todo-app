<template >
  <div>
    <div class="jumbotron">
     <div class="container">
       <h1>Hello, world!</h1>
       <p>Ez egy szimpla webes alkalmazás user authentikációval full JS alapon. A backendet <strong>Node.js/Express + MongoDB</strong> szolgáltatja, a frontend pedig <strong>Vue.js</strong> alatt fut.</p>
       <p v-if="!loggedIn"><router-link to="/login" class="btn btn-primary">Belépés &raquo;</router-link> <router-link to="/register" class="btn btn-info">Regisztráció &raquo;</router-link></p>
       <p v-if="loggedIn"><router-link to="/create" class="btn btn-primary">Todo kreálás &raquo;</router-link> <router-link to="/profil" class="btn btn-info">Profil &raquo;</router-link></p>

     </div>
   </div>
   <p>A projekt célja az volt, hogy</p>


     <div class="row">
       <div class="col-xs-12 col-md-4">
         <h3>Node.js + Express</h3>
         <p>A szerver oldali részt Node.js/Express környezet végzi. Alapvető CRUD, authentikációval ellátott API.</p>
         <p><a class="btn btn-default" href="https://nodejs.org/" target="_blank" role="button">Több infó &raquo;</a></p>
       </div>
       <div class="col-xs-12 col-md-4">
         <h3>Vue.js</h3>
         <p>A kliens oldali megjelenítésért a Vue.js a felelős, valamint a Bootstrap framework.</p>
         <p><a class="btn btn-default" href="https://vuejs.org" target="_blank" role="button">Több infó &raquo;</a></p>
      </div>
       <div class="col-xs-12 col-md-4">
         <h3>JWT</h3>
         <p>A felhasználó authentikációt JWT tokenekkel végzi az app.</p>
         <p><a class="btn btn-default" href="https://jwt.io" target="_blank" role="button">Több infó &raquo;</a></p>
       </div>
     </div>

   <hr>
</div>
</template>

<script>
import AuthServce from '../services/AuthService.js';
const auth = new AuthServce();

export default {
  data() {
    return {
        loggedIn: false
    }
  },
  created(){
    this.loggedIn = auth.isLoggedIn();
  }
}
</script>

<style lang="css">
.jumbotron{
  box-shadow: 1px 1px 5px 0px #727272 !important;
}
</style>
