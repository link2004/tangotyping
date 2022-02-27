<template>
  <div class="container text-center mt-5">
    <div class="card mx-auto shadow input-form">
      <div class="card-body">
        <h5 class="card-title">ログイン</h5>
        <div class="text-left">
          <label for="user-id">メールアドレス</label>
          <input type="email" class="form-control" id="user-id" v-model="input_userID">
          <label for="pass">パスワード</label>
          <input type="password" class="form-control" id="pass" v-model="input_pass">
        </div>
        <div v-for="(msg,key) in msg_list" class="text-danger" :key="key">{{msg}}</div>
        <button @click="Clicked_login" class="btn btn-primary btn-block" :disabled="isLoading">
          <div v-show="isLoading">Loading...</div>
          <div v-show="!isLoading">ログイン</div>
        </button>
        <div>or</div>
        <router-link to="/signup"  class="text-primary">サインアップ</router-link>
      </div>
      
    </div>
  </div>
</template>

<script>
import cognito from '../cognito.js'
export default {
  data() {
    return {
      input_userID:"",
      input_pass:"",
      token:"",
      msg_list: [],
      isLoading: false
    }
  },
  methods: {
    Clicked_login: function(){
      this.msg_list = [];
      if (!this.input_userID)this.msg_list.push("ユーザーIDを入力してください");
      if (!this.input_pass)this.msg_list.push("パスワードを入力してください");
      
      if(this.input_userID || this.input_pass){
        this.login();
      }

    },
    login: async function(){
      var result = await cognito.signIn(this.input_userID, this.input_pass);
      if(result){
        // this.$router.push({name:'mypage'});
        console.log("login success!");
      }
    }
  }
}
</script>