<template>
  <div id="app" class="container text-center mt-5">
    <div>
      <div class="input-form">
        <p>ユーザー名</p>
        <input type="text" v-model="input_userID">
        <p>パスワード</p>
        <input type="password" v-model="input_pass">
      </div>
      <p class="text-danger">{{msg}}</p>
      <button v-on:click="login" class="btn btn-primary">ログイン</button>
      <router-link to="/signin"  class="btn btn-secondary">サインイン</router-link>
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
      token:"",
      msg: "",
    }
  },
  methods: {
    login: function(){
      var response = api.login(this.input_userID,this.input_pass);
      if(response.statusCode == 200){
        this.$cookies.set('LoginToken',response.Item.token);
        this.$parent.Login();
        this.$router.push({name:'home'});
      }else{
        this.msg = "パスワードまたはユーザー名が違います"
      }
    }
  }
}
</script>

<style>
.input-form p {
  margin: 0;
}
.input-form input {
  margin-bottom: 1rem;
}
</style>