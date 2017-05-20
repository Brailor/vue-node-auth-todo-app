<template>
  <form v-on:submit.prevent="validateBeforeSubmit">
    <div class="form-group" :class="{'has-error': errors.has('username') }">
      <label for="username">Felhasználónév</label>
      <input type="text" v-model="userInputData.username" id="username" v-validate="'required'" name="username" class="form-control" placeholder="Add meg a felhasználónevet...">
      <p class="text-danger" v-if="errors.has('username')">{{ errors.first('username') }}</p>
    </div>
    <div class="form-group" :class="{'has-error': errors.has('password') }">
      <label for="password">Jelszó</label>
      <input type="password" v-model="userInputData.password" id="password" v-validate="'required'" name="password" class="form-control" placeholder="Add meg a jelszót...">
        <p class="text-danger" v-if="errors.has('password')">{{ errors.first('password') }}</p>
    </div>
    <input type="submit" value="Bejelentkezés" class="btn btn-primary">
  </form>
</template>

<script>



export default {
  data() {
    return{
      userInputData: {
        username: '',
        password: ''
      }
    }
  },
  methods:{
    validateBeforeSubmit() {

      this.$validator.validateAll()
        .then(() => {
            this.$http.post('http://localhost:3000/users/auth', {
              username: this.userInputData.username,
              password: this.userInputData.password
            })
              .then(response => {
                if(response.ok){
                  if(response.body.success) {
                    localStorage.clear();
                    localStorage.setItem('auth_token', response.body.token);
                    this.$swal('Üdv!', response.body.message, 'success')
                    .then(() => this.$router.push({name: 'profil'}))
                  } else {
                    this.$swal('Oops...', response.body.message, 'error');
                  }
                } else {
                  throw Error('Valami baj van a szerverrel!');
                }
              }, error => this.$swal('Oops...', error, 'error'))

        })
        .catch(() => {
          this.$swal('Oops...','Valamilyen adat hiányzik!', 'error');
        })
    }
  }
}
</script>

<style lang="css">
</style>
