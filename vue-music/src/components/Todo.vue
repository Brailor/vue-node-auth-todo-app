<template >
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">Todo Neve: <strong>[ {{todo.name}} ]</strong></h3>
    </div>
    <div class="panel-body">
      <ul class="list-group">
          <li class="list-group-item">Kategória: {{todo.category}}</li>
          <li class="list-group-item">Prioritás: {{todo.priority}}</li>
          <li class="list-group-item">Határidő dátuma: <strong> [ {{todo.due_date.toString().substring(0,10) }} ] </strong></li>
          <li class="list-group-item">Létrehozás dátuma: <strong> [ {{todo.created_date.toString().substring(0,10)}} ]</strong></li>
          <li class="list-group-item">Todo leírása: <br> <strong>{{todo.desc}}</strong></li>
        </ul>
    </div>
     <div class="panel-footer"><router-link to='/profil' class="btn btn-default">Vissza</router-link></div>
  </div>
</template>

<script>
export default {
  data() {
    return{
      todo: {}
    }
  },
  created() {
    if(this.$route.params.todo !== undefined){
      this.todo = this.$route.params.todo;
      localStorage.setItem('todo', JSON.stringify(this.todo));
    } else {
      this.todo = JSON.parse(localStorage.getItem('todo'));
    }
  },
  beforeDestroy() {
    localStorage.removeItem('todo');
  }
}
</script>

<style scoped lang="css">
</style>
