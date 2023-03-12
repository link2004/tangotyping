<template>
<div class="text-center py-5">
  <div>
    <h1 class="border-bottom mb-4">マイ単語帳</h1>
    <div @click="CreateNew" class="btn btn-outline-primary btn-block block-element mx-auto mb-5">単語帳を作成</div>
      <div style="height:40rem;">
        <h3 v-if="isLoading">読み込み中...</h3>
          <div
          v-for="(question,key) in this.questions"
          :key=key
          @click="ClickedQuestion(question)">
            <div class="btn btn-info btn-block block-element mx-auto mb-3">{{question.title}}</div>
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
    // console.log(await Auth.currentAuthenticatedUser())
    this.isLoading = true;
    this.questions = await this.queryQuestions();
    this.isLoading = false;
  }
}
</script>

<style scoped>
.block-element {
  font-size: 2rem;
  width: 20rem;
  border-radius: 1rem;
  padding: 1rem;
  width: 100%;
}
</style>