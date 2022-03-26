<template>
  <div class="container text-center" style="padding: 15.5rem 0rem;">
    <div class="card mx-auto shadow input-form">
      <div class="card-body">
        <h5 class="card-title">ログイン</h5>
        <div class="text-left">
          <label for="user-id">メールアドレス</label>
          <input type="text" class="form-control" id="user-id" v-model="input_userID">
          <label for="pass">パスワード</label>
          <input type="password" class="form-control" id="pass" v-model="input_pass">
        </div>
        <router-link to="/forgot" class="text-secondary">パスワードを忘れましたか？</router-link>
        <div v-for="(msg,key) in msg_list" class="text-danger" :key="key">{{msg}}</div>
        <button @click="Clicked_login" class="btn btn-primary btn-block" :disabled="isLoading">
          <div v-show="isLoading">Loading...</div>
          <div v-show="!isLoading">ログイン</div>
        </button>
        <div>or</div>
        <router-link to="/signup"  class="text-primary">アカウント作成</router-link>
      </div>
      
    </div>
  </div>
</template>
<script>
import { Auth } from 'aws-amplify'

export default {
  data(){
    return {
      input_userID:"",
      input_pass:"",
      msg_list: [],
      isLoading: false,
      formFields: [
        {
          type: "name",
          label: "ユーザー名",
          placeholder: "ユーザー名を入力"
        },
        {
          type: "email",
          label: "メールアドレス",
          placeholder: "メールアドレスを入力"
        },
        {
          type: "password",
          label:"パスワード",
          placeholder: "パスワードを入力",
          inputProps: {required: true, autocomplete: "new-password"}
        }
      ]
    }
  },
  methods:{
    Clicked_login: function(){
      this.msg_list = [];
      if (this.input_userID=="")this.msg_list.push("メールアドレスを入力してください");
      if (this.input_pass=="")this.msg_list.push("パスワードを入力してください");
      if (this.input_userID!="" && this.input_pass!=""){
        this.login();
      }
    },
    login: async function(){
      this.isLoading = true;
      try {
        await Auth.signIn(this.input_userID,this.input_pass);
        this.$router.push({name: "home"});//homeへ移動
      } catch (error) {
        this.msg_list.push("パスワードまたはユーザー名が違います");
      }
      this.isLoading = false;
    }
  },
  mounted: function() {
    if(this.$route.query.email)this.input_userID = this.$route.query.email;
  },
}
</script>