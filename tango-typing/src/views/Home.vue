<template>
  <div class="text-left">
    <div class="py-5 text-center">
      <strong style="font-size:9vw">TangoTyping</strong>
      <h2>単語帳タイピング</h2>
    </div>

    <div
    class="btn btn-outline-primary btn-block block-element mx-auto mb-5 shadow"
    style="width:100%"
    @click="CreateNew">単語帳を作成</div>

    <!-- <div class="card mb-5 shadow">
      <div class="card-header"><h3>単語帳IDからプレイ</h3></div>
      <div class="card-body">
        <form class="form-inline">
          <input type="text" class="form-control my-2 mr-2" style="width:25rem;" placeholder="search ID" v-model="inputQuestionID">
          <div class="btn btn-outline-success my-2" @click=searchFromID>検索</div>
        </form>
      </div>
    </div> -->
    
    <div style="padding-bottom:10rem;">
      <h2 class="text-left border-bottom mb-4">サンプル</h2>
      <div class="btn btn-info btn-block block-element" @click=ClickedQuestion>Fruit</div>
    </div>
    
    
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      inputQuestionID:null,
    }
  },
  methods:{
    ClickedQuestion: function(){
      this.$router.push({
        path:'m/typing/10e36549-3657-46a0-b3be-776375e91044',
      })
    },
    CreateNew: function(){
      this.$router.push({name:'edit',params:{id:"new"}});
    },
    searchFromID: function(){
      this.$router.push({
        path:`m/typing/${this.inputQuestionID}`,
      })
    }
  }
}
</script>
<style>
.block-element{
  font-size:2rem;
  width:20rem;
  border-radius:1rem;
  padding:2rem;
}
</style>