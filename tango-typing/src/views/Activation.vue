<template>
  <div class="container text-center mt-5">
    <div class="card mx-auto shadow input-form">
      <div class="card-body">
        <h5 class="card-title">メール確認</h5>
        <div class="text-left">
          <label for="email">メールアドレス</label>
          <input type="email" class="form-control" id="email" v-model="email">
          <label for="activationKey">確認コード</label>
          <input type="text" class="form-control" id="activationKey" v-model="activationKey">
        </div>
        <div v-for="(msg,key) in msg_list" class="text-danger" :key="key">{{msg}}</div>
        <button @click="Clicked_activation" class="btn btn-primary btn-block" :disabled="isLoading">
          <div v-show="isLoading">Loading...</div>
          <div v-show="!isLoading">送信</div>
        </button>
      </div>
      
    </div>
  </div>
</template>
<script>
import cognito from '../cognito.js'

export default {
  data() {
    return {
      email:"",
      activationKey:"",
      msg_list: [],
      isLoading: false,
    }
  },
  methods: {
    Clicked_activation: function(){
      this.msg_list = [];
      var flg = true;
      if(!this.email){this.msg_list.push("メールアドレスを入力してください");flg=false;}
      if(!this.activationKey){this.msg_list.push("確認コードを入力してください");flg=false;}

      if(flg){
        this.activate();
      }
    },
    activate: async function(){
      var result = await cognito.activate(this.email,this.activationKey);
      if(result){
        this.$router.push({
          path:'/login',
        })
      }
    }
  },
  mounted: function(){
    this.email = this.$route.query.email;
    this.activationKey = this.$route.query.code;
  }
}
</script>