<template>
  <div class="text-left">
    <div class="py-5 text-center">
      <strong style="font-size: 7rem;" class="slideup-text">単語タイピング</strong>
      <h1><span id="sub-title">英</span></h1>
      <p class="mt-4 text-black-50">英単語帳とタッチタイピングを組み合わせた無料のタイピングゲームです。</p>
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
      <h2 class="text-left">マイ単語帳</h2>
      <p class="border-bottom mb-4 text-black-50">自分で作った単語帳で、タイピングしながら英語を暗記しよう！</p>
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
        <div v-if="questions.length==0">
          <div class="btn btn-outline-info btn-block block-element" style="margin: 10px" @click="CreateNew">
            単語帳を作成
          </div>
        </div>
      </div>
    </div>

    <div style="padding-bottom: 10rem">
      <h2 class="text-left">サンプル</h2>
      <p class="border-bottom mb-4 text-black-50">英検やTOEICで使用される勉強におすすめの単語が多数収録！</p>
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
    loadAnimation(){
      let text = "単語帳 × タイピング";
      let i = 0;
      let intervalId = setInterval(function() {
        document.getElementById("sub-title").textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, 50); // 表示する間隔をミリ秒単位で指定します
    }
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
    this.loadAnimation();
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

.slideup-text {
  animation-name: slideUp;
  animation-duration: 1s; /* アニメーションの時間を指定します */
  animation-delay: 0s; /* アニメーションを開始する遅延時間を指定します */
  animation-timing-function: ease; /* アニメーションの速度曲線を指定します */
  animation-fill-mode: forwards; /* アニメーション終了時に要素のスタイルを維持するように指定します */
}

@keyframes slideUp {
  from {
    transform: translateY(100%); /* 開始時の位置を指定します */
    opacity: 0; /* 開始時の透明度を指定します */
  }
  to {
    transform: translateY(0); /* 終了時の位置を指定します */
    opacity: 1; /* 終了時の透明度を指定します */
  }
}
</style>