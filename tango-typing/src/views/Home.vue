<template>
<div id="app" class="container text-center mt-5">
  <div v-show="!isLogined" v-cloak>
  </div>

  <div v-show="isLogined" v-cloak>
    <div class="card">
      <div class="card-header">マイページ</div>
      <div class="card-body">
        <div @click="CreateNew" class="btn-primary new-btn">新規作成</div>
        <div id="table">
          <table class="table table-bordered table-sm">
            <tbody>
              <tr v-for="(question,key) in questions" :key=key>
                <td>
                  <div class="td">
                    <router-link class="question-link" :to="{name:'typing',params:{id:question.id}}">
                      {{question.title}}
                    </router-link>
                    <button @click="Edit(question.id)" class="edit-btn btn btn-secondary btn-sm">編集</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  </div>
</div>
</template>

<script>
import api from '../api.js'
export default {

  data() {
    return {
      questions: [],
      isLogined: false,
      userID: "",
    }
  },
  methods:{
    CreateNew: function(){
      this.$cookies.set('TableID',null);
      this.$router.push({name:'edit'});
    },
    Edit: function(id){
      this.$cookies.set('TableID',id);
      this.$router.push({name:'edit'});
    }
  },
  mounted: function(){
    this.userID = this.$parent.userID;
    this.isLogined = this.$parent.isLogined;
    if(this.isLogined){
      var items = api.queryQuestion(this.userID).questions;
      for (var item in items){
        this.questions[item] = {
          "title":items[item].title,
          "id":items[item].id
        };
      }
    }
  }
}
</script>

<style>
#table{
  max-height:300px;
  overflow-y: scroll;
}
.new-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
}
.question-link{
  margin:auto;
}
.td{
  display: flex;
}

</style>