<template>
  <div class="container text-center mt-5">
    <div class="card mx-auto shadow input-form">
      <div class="card-body">
        <h5 class="card-title">サインアップ</h5>
        <div class="text-left">
          <label for="user-id">ユーザー名</label>
          <input type="text" class="form-control" id="user-id" v-model="input_userID">
          <label for="pass">パスワード</label>
          <input type="password" class="form-control" id="pass" v-model="input_pass">
          <label for="pass2">パスワード（確認）</label>
          <input type="password" class="form-control" id="pass2" v-model="input_pass2">
        </div>
        <div v-for="(msg,key) in msg_list" class="text-danger" :key="key">{{msg}}</div>
        <button @click="Clicked_signup" class="btn btn-primary btn-block" :disabled="isLoading">
          <div v-show="isLoading">Loading...</div>
          <div v-show="!isLoading">サインアップ</div>
        </button>
        <div>or</div>
        <router-link to="/login"  class="text-primary">ログイン</router-link>
      </div>
      
    </div>
  </div>
</template>
<script>
import api from '../api.js'
export default {
  data() {
    return {
      input_userID:"",
      input_pass:"",
      input_pass2:"",
      token:"",
      msg_list: [],
      isLoading: false,
    }
  },
  methods: {
    Clicked_signup: function(){
      this.msg_list = [];

      var flg = true;
      if(this.input_userID == ""){this.msg_list.push("ユーザーIDを入力してください");flg=false;}
      if(this.input_pass == ""){this.msg_list.push("パスワードを入力してください");flg=false;}
      if(this.input_pass2 == ""){this.msg_list.push("パスワード（確認用）を入力してください");flg=false;}
      if(this.input_pass != this.input_pass2 && flg == true){this.msg_list.push("パスワードが一致しません");flg=false;}

      if(flg){
        this.signup();
      }
    },
    signup: function(){
      
      this.isLoading = true;
      var response = api.signup(this.input_userID,this.input_pass);
      console.log(response);
      if(response.statusCode == 200){
        response = api.login(this.input_userID,this.input_pass);
        if(response.statusCode == 200){
          this.$cookies.set('LoginToken',response.Item.token);
          this.$parent.Login();
          this.$router.push({name:'mypage'});
        }
      }else{
        this.msg_list.push("そのユーザーIDは既に存在しています");
      }
      this.isLoading = false;
    }
  }
}
</script>