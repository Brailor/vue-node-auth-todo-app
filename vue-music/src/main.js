import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';
import VueSweetAlert from 'vue-sweetalert'
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';

import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Home from './components/Home.vue';
import Profil from './components/Profil.vue';
import Create from './components/Create.vue';
import Todo from './components/Todo.vue';



import  AuthService from './services/AuthService.js';
const auth = new AuthService();

Vue.use(VeeValidate);
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueSweetAlert);
Vue.use(BootstrapVue);

const routes = [
  { path: '/', name: 'home' ,component: Home },
  { path: '/login', name: 'login' , component: Login },
  { path: '/register', name: 'register' , component: Register },
  { path: '/profil', name: 'profil', component: Profil, meta: {userOnly: true}},
  { path: '/create', name: 'create', component: Create, meta: {userOnly: true}},
  { path: '/todo/:todoId', name: 'todo', component: Todo, meta: {userOnly: true}}
];

const router = new VueRouter({
  mode:'history',
  routes: routes
})

router.beforeEach((to, from, next) => {

  //megnézzük, hogy a route védett-e
  if(to.matched.some(record => record.meta.userOnly)){
    //ha igen és a user nincs belogolva, akkor loginhoz irányítjuk
    if(!auth.isLoggedIn()){
      alert('Kérlek jelentkezz be újra')
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })

      //ha be van logova és védett routra megy frissítsük a tokenjét
  } else {
    auth.refreshToken();
    next();
  }
} else{
  next();
  }
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
