<template>
<div class="text-center mt-5">
  <div v-show="!this.$parent.isLogined" v-cloak>
  </div>

  <div v-show="this.$parent.isLogined" v-cloak>

    <div @click="CreateNew" class="btn-primary new-btn mb-3" style="font-size:1.3rem">新規作成</div>
    <div class="card shadow-sm mb-2">
      <div class="card-header p-2 bg-secondary text-white" style="font-size:1.3rem">マイ単語帳</div>
      <div class="card-body list-body" style="font-size:1.4rem;font-weight:bold;">
        <div class="px-4">
          <div
          class="card mb-2 shadow-sm bg-light"
          v-for="(question,key) in this.$parent.questions"
          :key=key
          @click="ClickedQuestion(question)">
            <div class="card-body p-2">{{question.title}}</div>
          </div>
        </div>
      </div>
    </div>

    <b-modal id="start-menu" size="lg" centered hide-header ok-only ok-title="閉じる">
      <b-container class="modal-body" fluid>
        <div class="my-auto">
          <h1 class="mb-4">{{selected_question.title}}</h1>
          <button
          class="btn btn-primary btn-block"
          style="font-size:1.7rem;"
          @click="$router.push({name:'typing',params:{id:selected_question.id}})">
            スタート
          </button>
          <button
          @click="Edit(selected_question.id)"
          class="edit-btn btn btn-secondary btn-block">
            編集
          </button>
        </div>
      </b-container>
    </b-modal>

  </div>
</div>
</template>

<script>
export default {

  data() {
    return {
      questions: [],
      isLogined: false,
      userID: "",
      selected_question: {
        title: null,
        id: null
      },
    }
  },
  methods:{
    CreateNew: function(){
      this.$router.push({name:'edit'});
    },
    Edit: function(id){
      this.$router.push({name:'edit',params:{id:id}})
    },
    ClickedQuestion: function(item){
      console.log(item);
      this.selected_question = item;
      this.$bvModal.show('start-menu');
    }
  }
}
</script>

<style>
#start-menu{
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