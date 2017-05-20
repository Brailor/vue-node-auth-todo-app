<template>
  <div>
    <h1>Üdv, {{user.username}}!</h1><br>
      <h2 class="page-header">Aktuális Todok</h2>
      <div class="jumbotron">
        <div class="row">
          <div class="col-sm-12 col-md-10 col-md-offset-1 col-lg-12">
            <div v-if="user.todos.length === 0">
              <h5>Neked jelenleg nincs aktív Todod! Kattints <router-link to='/create'>ide</router-link>, ha szeretnél csinálni egyet.</h5>
            </div>
            <table v-else class="table table-striped table-responsive">
              <thead>
                  <tr>
                    <th>Elvégezve</th>
                    <th>Prioritás</th>
                    <th>Todo neve</th>
                    <th>Határidő</th>
                    <th>Létrehozva</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="todo in user.todos" :class="{completed: todo.completed}">
                    <th scope="row"><a @click="completeTodo(todo)" class="btn btn-default">X</a></th>
                    <td :class="{ 'completed-todo' : todo.completed}"><strong>{{todo.priority}}</strong></td>
                    <td :class="{ 'completed-todo' : todo.completed}"><strong>{{todo.name}}</strong></td>
                    <td :class="{ 'completed-todo' : todo.completed}"><strong>{{todo.due_date | datetoString }}</strong></td>
                    <td :class="{ 'completed-todo' : todo.completed}">{{todo.created_date | datetoString }}</strong></td>
                    <td>
                        <a  @click="viewTodo(todo)" class="btn btn-success">Bővebben</a>
                        <a  @click="toggleModal(todo)" class="btn btn-info">Módosítás</a>
                        <a  @click="deleteTodo(todo)" class="btn btn-danger">Törlés</a>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>

    </div>

<!--MODAL-->
<div class="modal fade" tabindex="-1" :class="{ in : showModal }" :style=" modalStyle ">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Todo Módosítása</h4>
        </div>
        <div class="modal-body">
          <form @submit.prevent="validateBeforeSubmit">
              <div class="form-group" :class="{'has-error': errors.has('todo-name') }">
                <label for="todo-name">Todo neve</label>
                <input type="text" v-model="todo.name" :value="todo.name" id="todo-name" v-validate="'required'"  name="todo-name" class="form-control" placeholder="Add meg a Todo nevét...">
                <span class="text-danger" v-if="errors.has('todo-name')">{{ errors.first('todo-name') }}</span>
              </div>
              <div class="form-group" :class="{'has-error': errors.has('todo-category') }">
                <label for="todo-category">Todo kategória</label>
                <input type="text" v-model="todo.category" :value="todo.category" id="todo-category" v-validate="'required'" name="todo-category" class="form-control" placeholder="Add meg a Todo kategóriáját...">
                <span class="text-danger" v-if="errors.has('todo-category')">{{ errors.first('todo-category') }}</span>
              </div>
              <div class="form-group" :class="{'has-error': errors.has('todo-desc') }">
                <label for="todo-desc">Todo leírása</label>
                <textarea rows="2" v-model="todo.desc" :value="todo.desc" id="todo-desc" v-validate="'required'" name="todo-desc" class="form-control" placeholder="Add meg a Todo leírását..."></textarea>
                <span class="text-danger" v-if="errors.has('todo-desc')">{{ errors.first('todo-desc') }}</span>
              </div>
                <div class="row">
              <div class="col-md-6" :class="{'has-error': errors.has('todo-priority') }">
                <label for="todo-priority">Todo prioritása</label>
                <select class="form-control" v-validate="'required'" name="todo-priority" id="todo-priority" v-model="todo.priority">
                  <option disabled value="">Válassz egy szintet!</option>
                  <option v-for="priority in priorities" :value="priority.number">{{priority.name}}</option>
                </select>
                <span class="text-danger" v-if="errors.has('todo-priority')">{{ errors.first('todo-priority') }}</span>
              </div>
                <div class="col-md-6" :class="{'has-error': errors.has('todo-due') }">
                  <div class="form-group" >
                    <label for="todo-due">Todo határideje</label>
                    <input type="date" v-model="todo.due_date" :value="todo.due_date" id="todo-due" v-validate="'required'" name="todo-due" class="form-control">
                    <span class="text-danger" v-if="errors.has('todo-due')">{{ errors.first('todo-due') }}</span>
                </div>
              </div>
            </div>
              <input type="submit" value="Mentés" class="btn btn-success">
          </form>
          </div>
        <div class="modal-footer">
          <button type="button" @click="toggleModal" class="btn btn-primary" >Bezár</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import AuthServce from '../services/AuthService.js';
const auth = new AuthServce();

export default {
  data() {
    return {
        user: {},
        showModal: false,
        todo: {},
        priorities: [{number: 1, name: 'Nagyon alacsony'}, {number: 2, name: 'Alacsony'}, {number: 3, name: 'Közepes'},
         {number: 4, name: 'Magas'}, {number: 5, name: 'Nagyon magas'}]
    }
  },
  computed: {
    modalStyle() {
       return this.showModal ? { display: 'block'} : {};
    }
  },
  methods: {
      viewTodo(todo) {
        this.$router.push({name: 'todo', params: {todoId: todo._id, todo: todo}})
      },
      completeTodo(todo){
        todo.completed = !todo.completed;
        let token = localStorage.getItem('auth_token');
        this.$http.put('http://localhost:3000/users/edittodo', {todo:{
          todoName: todo.name,
          todoDesc:todo.desc,
          todoDue:todo.due_date,
          todoCompl: todo.completed,
          todoPriority: todo.priority,
          todoCategory: todo.category,
          todoId: todo._id
        }}, {headers: {'Authorization': token}})
      },
      deleteTodo(todo) {
        this.user.todos = this.user.todos.filter(element => {
          return element._id !== todo._id;
        });
        let token = localStorage.getItem('auth_token');
        this.$http.delete('http://localhost:3000/users/deletetodo', {headers: {'Authorization': token}, body:{todoId: todo._id}})
           .then(response => {
             this.$swal('Siker!', response.body.message, 'success');
           })
           .catch(err => {
              this.$swal('Oops...', 'Valami hiba történt, próbáld meg újra!', 'error');
           });
      },
      toggleModal (todo) {
        this.todo = todo;
        return this.showModal = !this.showModal;
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then(() => {

          let token = localStorage.getItem('auth_token');
          this.$http.put('http://localhost:3000/users/edittodo', {todo:{
            todoName: this.todo.name,
            todoDesc: this.todo.desc,
            todoDue: this.todo.due_date,
            todoCompl: this.todo.completed,
            todoId: this.todo._id,
            todoPriority: this.todo.priority,
            todoCategory: this.todo.category
          }}, {headers: {'Authorization': token}})
                .then(response =>  {
                  this.$swal('Siker!', response.body.message, 'success').then(() => {
                    this.showModal = false;
                  })
                })
                .catch(err => this.$swal('Oops...', 'Valami hiba történt, próbáld meg újra!', 'error'));
          })
          .catch(() => {
              this.$swal('Hiba!','Valamilyen adat hiányzik!', 'error');
          })
        }
      },
  created(){
      let token = localStorage.getItem('auth_token');
      this.$http.get('http://localhost:3000/users/profil', {headers: {'Authorization': token}})
            .then(auth.validateResponse)
            .then((response) => {

              this.user = response.body.user;
            })
            .catch(err => {
              this.$swal('Oops...', 'Valami hiba történt, próbáld meg újra!', 'error');
              console.log(err);
            });
        },
  filters:{
    datetoString: (value) => {
      if(!value) return '';
      return value.toString().substring(0, 10);
    }
  }
}

</script>

<style scoped lang="css">
  .jumbotron{
    background-color: #fff !important;
  }
  .completed{
    background-color: #64C2A0 !important;
  }
  .completed-todo{
    text-decoration: line-through !important;
  }
  select{
    height: 37px !important;
  }
</style>
