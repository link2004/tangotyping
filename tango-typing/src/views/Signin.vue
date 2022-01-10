<template>
  <div id="app" class="container text-center mt-5">
    <div>
      <div class="input-form">
        <p>ユーザー名</p>
        <input type="text" v-model="input_userID">
        <p>パスワード</p>
        <input type="password" v-model="input_pass">
        <p>パスワード（確認）</p>
        <input type="password" v-model="input_pass2">
      </div>
      <p class="text-danger">{{msg}}</p>
      <button v-on:click="signin" class="btn btn-primary">サインイン</button>
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
      msg: ""
    }
  },
  methods: {
    signin: function(){
      if(this.input_pass != this.input_pass2){
        this.msg = "パスワードが一致しません";
        return
      }

      var response = api.signin(this.input_userID,this.input_pass);
      if(response.statusCode == 200){
        response = api.login(this.input_userID,this.input_pass);
        if(response.statusCode == 200){
          this.$cookies.set('LoginToken',response.Item.token);
          this.$parent.Login();
          this.$router.push({name:'home'});
        }
      }else{
        this.msg = "そのユーザー名は既に存在しています";
      }
    }
  }
}
</script>