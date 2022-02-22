<template>
<div class="text-center mt-5">
  <div v-show="!this.$parent.isLogined" v-cloak>
  </div>

  <div v-show="this.$parent.isLogined" v-cloak>

    <div @click="CreateNew" class="btn-primary new-btn mb-3" style="font-size:1.3rem">新規作成</div>
    <div class="card shadow-sm mb-2">
      <div class="card-header p-2 bg-info text-white" style="font-size:1.3rem">マイ単語帳</div>
      <div class="card-body list-body" style="font-size:1.4rem;font-weight:bold;">
        <div class="px-4">
          <div
          class="card mb-2 shadow-sm bg-light"
          v-for="(question,key) in this.questions"
          :key=key
          @click="ClickedQuestion(question)">
            <div class="card-body p-2">{{question.title}}</div>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import api from '../api.js'

export default {
  data() {
    return {
      questions: [],
      userID: "",
      state: "",
    }
  },
  methods:{
    CreateNew: function(){
      this.$router.push({name:'edit',params:{id:"new"}});
    },
    ClickedQuestion: function(item){
      console.log(item);
      this.$router.push({
        name:'start',
        params:{
          id:item.id,
        },
      })
    },
    queryQuestions: function(userID){
      //userIDから、問題をクエリ
      var questions = [];
      var items = api.queryQuestion(userID).questions;
      for (var item in items){
        questions[item] = {
          "title":items[item].title,
          "id":items[item].id
        };
      }
      return questions;
    }
  },
  mounted: function() {
    if(!this.$parent.isLogined)this.$router.push({name:'login'});
    this.questions = this.queryQuestions(this.$parent.userID);
  },
}
</script>

<style>
#typing-modal{
  text-align: center;
}
.list-body{
  max-height:40rem;
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