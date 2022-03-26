<template>
<div class="text-center py-5">
  <div>
    <div @click="CreateNew" class="btn-primary new-btn mb-3" style="font-size:1.3rem">新規作成</div>
    <div class="card shadow-sm mb-2">
      <div class="card-header p-2 bg-info text-white" style="font-size:1.3rem">マイ単語帳</div>
      <div class="card-body list-body" style="font-size:1.4rem;font-weight:bold; height:40rem;">
        <h3 v-if="isLoading">読み込み中...</h3>
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
      isLoading: false,
    }
  },
  methods:{
    CreateNew: function(){
      this.$router.push({name:'edit',params:{id:"new"}});
    },
    ClickedQuestion: function(item){
      this.$router.push({
        name:'start',
        params:{
          id:item.id,
        },
      })
    },
    queryQuestions: async function(){
      //userIDから、問題をクエリ
      var questions = [];
      var items = await api.queryQuestion();
      for (var item in items.questions){
        questions[item] = {
          "title":items.questions[item].title,
          "id":items.questions[item].id
        };
      }
      return questions;
    }
  },
  mounted: async function() {
    this.isLoading = true;
    this.questions = await this.queryQuestions();
    this.isLoading = false;
  }
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