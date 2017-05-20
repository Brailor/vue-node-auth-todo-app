<template lang="html">
  <div class="jumbotron">
    <form  @submit.prevent="onClickSubmit">
      <div class="form-group" :class="{'has-error': errors.has('todo-name') }">
        <label for="todo-name">Todo neve</label>
        <input type="text" v-model="todo.todoName" id="todo-name" v-validate="'required'"  name="todo-name" class="form-control" placeholder="Add meg a Todo nevét...">
        <span class="text-danger" v-if="errors.has('todo-name')">{{ errors.first('todo-name') }}</span>
      </div>
      <div class="form-group" :class="{'has-error': errors.has('todo-category') }">
        <label for="todo-category">Todo kategória</label>
        <input type="text" v-model="todo.todoCategory" id="todo-category" v-validate="'required'" name="todo-category" class="form-control" placeholder="Add meg a Todo kategóriáját...">
        <span class="text-danger" v-if="errors.has('todo-category')">{{ errors.first('todo-category') }}</span>
      </div>
      <div class="form-group" :class="{'has-error': errors.has('todo-desc') }">
        <label for="todo-desc">Todo leírása</label>
        <textarea rows="2" v-model="todo.todoDesc" id="todo-desc" v-validate="'required'" name="todo-desc" class="form-control" placeholder="Add meg a Todo leírását..."></textarea>
        <span class="text-danger" v-if="errors.has('todo-desc')">{{ errors.first('todo-desc') }}</span>
      </div>
        <div class="row">
      <div class="col-md-6" :class="{'has-error': errors.has('todo-priority') }">
        <label for="todo-priority">Todo prioritása</label>
        <select class="form-control" v-validate="'required'" name="todo-priority" id="todo-priority"v-model="todo.todoPriority">
          <option disabled value="">Válassz egy szintet!</option>
          <option v-for="priority in priorities" :value="priority.number">{{priority.name}}</option>
        </select>
        <span class="text-danger" v-if="errors.has('todo-priority')">{{ errors.first('todo-priority') }}</span>
      </div>
        <div class="col-md-6" :class="{'has-error': errors.has('todo-due') }">
          <div class="form-group" >
            <label for="todo-due">Todo határideje</label>
            <input type="date" v-model="todo.todoDue" id="todo-due" v-validate="'required'" name="todo-due" class="form-control">
            <span class="text-danger" v-if="errors.has('todo-due')">{{ errors.first('todo-due') }}</span>
        </div>
      </div>
        <input type="submit" value="Hozzáad" class="btn btn-primary">
    </div>



    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todo:{
        todoName: '',
        todoDesc: '',
        todoDue: '',
        todoPriority: '',
        todoCategory: ''
      },
      priorities: [{number: 1, name: 'Nagyon alacsony'}, {number: 2, name: 'Alacsony'}, {number: 3, name: 'Közepes'},
       {number: 4, name: 'Magas'}, {number: 5, name: 'Nagyon magas'}]
    }
  },
  methods:{
    onClickSubmit() {
      this.$validator.validateAll().then(() => {
        let token = localStorage.getItem('auth_token');
        this.$http.post('http://localhost:3000/users/addtodo', {todo: this.todo}, {headers: {
          'Authorization': token
        }})
          .then(response => {
          this.$swal('Siker!', response.body.message, 'success')
            .then(() => this.$router.push({name: 'profil'}))
          })
          .catch(err => {
            this.$swal('Error', err.statusText, 'error');
          });
        })
        .catch(() => {
            this.$swal('Error', 'Valamilyen adat hiányzik!', 'error');
        })
    }
  }
}
</script>

<style scoped lang="css">
  .btn{
      margin-left: 35%;
  }
  select{
    height: 37px !important;
  }
@media (min-width: 480px) {
    .btn{
          margin-left: 88%;
    }
}
</style>
