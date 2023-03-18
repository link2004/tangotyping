<template>
  <div class="text-left">
    <div class="py-5 text-center">
      <strong style="font-size: 6vw;">単語タイピング</strong>
      <h1>TangoTyping</h1>
    </div>

    <div
      class="btn btn-info btn-block block-element mx-auto mb-3 shadow"
      style="width: 100%"
      @click="$router.push({ name: 'mypage' })"
    >
      マイ単語帳一覧
    </div>
    <div
      class="btn btn-outline-primary btn-block block-element mx-auto mb-5 shadow"
      style="width: 100%"
      @click="CreateNew"
    >
      単語帳を作成
    </div>

    <!-- <div class="card mb-5 shadow">
      <div class="card-header"><h3>単語帳IDからプレイ</h3></div>
      <div class="card-body">
        <form class="form-inline">
          <input type="text" class="form-control my-2 mr-2" style="width:25rem;" placeholder="search ID" v-model="inputQuestionID">
          <div class="btn btn-outline-success my-2" @click=searchFromID>検索</div>
        </form>
      </div>
    </div> -->
    <div v-if="user" style="padding-bottom: 3rem">
      <h2 class="text-left border-bottom mb-4">マイ単語帳</h2>
      <h3 v-if="isLoading">読み込み中...</h3>
      <div style="display: flex; flex-wrap: wrap">
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="btn btn-info btn-block block-element"
          style="margin: 10px"
          @click="ClickedQuestion(question.id)"
        >
          {{ question.title }}
        </div>
      </div>
    </div>

    <div style="padding-bottom: 10rem">
      <h2 class="text-left border-bottom mb-4">サンプル</h2>
      <div
        class="btn btn-info btn-block block-element"
        @click="ClickedQuestion('10e36549-3657-46a0-b3be-776375e91044')"
      >
        Fruit
      </div>
    </div>

    <div></div>

    <router-view></router-view>
  </div>
</template>
<script>
import api from "../api.js";
export default {
  data() {
    return {
      questions: [],
      inputQuestionID: null,
      isLoading: false,
    };
  },
  methods: {
    ClickedQuestion: function(id){
      this.$router.push({
        path: `m/typing/`+id,
      })
    },
    CreateNew: function () {
      this.$router.push({ name: "edit", params: { id: "new" } });
    },
    searchFromID: function () {
      this.$router.push({
        path: `m/typing/${this.inputQuestionID}`,
      });
    },
    queryQuestions: async function () {
      //userIDから、問題をクエリ
      var questions = [];
      var items = await api.queryQuestion();
      for (var item in items.questions) {
        questions[item] = {
          title: items.questions[item].title,
          id: items.questions[item].id,
        };
      }
      return questions;
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted: async function () {
    this.isLoading = true;
    this.questions = await this.queryQuestions();
    this.isLoading = false;
  },
};
</script>
<style>
.block-element {
  font-size: 2rem;
  width: 20rem;
  border-radius: 1rem;
  padding: 2rem;
}
</style>