import Vue from 'vue';
import VueResource from 'vue-resource';


Vue.use(VueResource);


export default class AuthServce {


    refreshToken() {
      let oldToken = localStorage.getItem('auth_token');
      if(oldToken) {
        let newToken = async () => {
          try{
            let response = await Vue.http.get('http://localhost:3000/users/rjwt', {
               headers: { 'Authorization' : oldToken} });
               localStorage.removeItem('auth_token');
               localStorage.setItem('auth_token', response.body.token);
               console.log('refreshed token');
          }
          catch(err){
            localStorage.clear();
            window.location.reload(false);
          }
        }
        newToken();
      } else {
        console.log('No token');
      }
    }

    isLoggedIn(){
      if(localStorage.getItem('auth_token')){
        return true;
      }
      return false;
    }
    logoutUser(){

        localStorage.clear();
        window.location.reload(false);
    }

    validateResponse(response) {
      if(response.ok === false) {
        throw Error(response.status.text);
      }
      return response;
    }

    logResponse(response) {
      console.log(response);
      return response;
    }

    logError(error) {
      localStorage.clear();
      window.location.reload(false);
      console.log(error);

    }
}
