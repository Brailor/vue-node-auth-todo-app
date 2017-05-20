<template>
  <form v-on:submit.prevent="validateBeforeSubmit">
    <div class="form-group" :class="{'has-error': errors.has('username') }">
      <label for="username">Felhasználónév</label>
      <input type="text" id="username" v-model="newUser.username" v-validate="'required|min:5'" name="username" class="form-control" placeholder="Add meg a felhasználónevet...">
      <p class="text-danger" v-if="errors.has('username')">{{ errors.first('username') }}</p>
    </div>
    <div class="form-group" :class="{'has-error': errors.has('email') }">
      <label for="email">Email</label>
      <input v-model="newUser.email" v-validate="'required|email'" name="email" type="text" class="form-control" placeholder="Add meg az email címet..">
      <p class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</p>
    </div>
    <div class="form-group" :class="{'has-error': errors.has('confirm_field') }">
      <label for="password">Jelszó</label>
      <input type="password" id="password" v-model="newUser.password"  v-validate="'required|min:4|confirmed:pw_confirm'" name="confirm_field" class="form-control" placeholder="Add meg a jelszót...">
        <p class="text-danger" v-if="errors.has('confirm_field')">{{ errors.first('confirm_field') }}</p>
    </div>
    <div class="form-group" :class="{'has-error': errors.has('confirm_field') }">
      <label for="password_conf">Jelszó megerősítés</label>
      <input type="password" id="password_conf" v-model="newUser.passwordConf"  v-validate="'required'"
       name="pw_confirm" class="form-control" placeholder="Jelszó megerősítés">
        <p class="text-danger" v-if="errors.has('pw_confirm')">{{ errors.first('pw_confirm') }}</p>
    </div>
    <input type="submit" value="Regisztráció" class="btn btn-primary">
  </form>
</template>

<script>
export default {
  data() {
    return {
        newUser: {
          username: '',
          password: '',
          passwordConf: '',
          email: ''
      }
    }
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll()
        .then(() => {
          //ha sikeres volt a validáció
          this.$http.post('http://localhost:3000/users/register', {
            username: this.newUser.username,
            email: this.newUser.email,
            password: this.newUser.password
          })
          .then(response => {
            //ha van már ilyen nevű user a rendszerben
            if(!response.body.success) {
              this.$swal('Hiba!', response.body.message, 'error');

            //és ha nincs...
            } else {
              this.$swal('Siker!', response.body.message, 'success').then(() => {
                  this.$router.push({ name: 'login'});
              })
            }
          }, err => console.log(err))
      })
      //ha nem volt sikeres a validáció
      .catch(() => {
        this.$swal('Hiba!', 'Valamilyen adat nincs megadva', 'error');
      })
    }
  }
}
</script>

<style lang="css">


</style>
