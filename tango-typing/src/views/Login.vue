<template>
  <div id="app" class="container text-center mt-5">
    <div>
      <div>
        <p>ユーザー名</p>
        <input type="text" v-model="input_userID">
        <p>パスワード</p>
        <input type="text" v-model="input_pass">
      </div>
      <button v-on:click="login">ログイン</button>
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
      token:""
    }
  },
  methods: {
    login: function(){
      var response = api.login(this.input_userID,this.input_pass);
      if(response.isSuccess){
        this.token = response.Item.token;
        this.$router.push({name:'home', params:{token: this.token}});
      }
    }
  }
}
</script>