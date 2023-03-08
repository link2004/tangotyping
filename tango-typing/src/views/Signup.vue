<template>
  <div class="container text-center" style="padding: 12.8rem 0rem;">
    <div class="card mx-auto shadow input-form">
      <div class="card-body">
        <h5 class="card-title">サインアップ</h5>
        <div class="text-left">
          <label for="user-id">ユーザー名</label>
          <input type="text" class="form-control" id="user-id" v-model="input_name">
          <label for="email">メールアドレス</label>
          <input type="email" class="form-control" id="email" v-model="input_email">
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
        <small>登録する際、<router-link to="/terms" class="link-primary">利用規約</router-link>に同意したとみなします。</small>
        <div>or</div>
        <router-link to="/login"  class="link-primary">ログイン</router-link>
      </div>
      
    </div>
  </div>
</template>
<script>
import { Auth } from 'aws-amplify'
export default {
  data() {
    return {
      input_name:"",
      input_email:"",
      input_pass:"",
      input_pass2:"",
      msg_list: [],
      isLoading: false,
    }
  },
  methods: {
    Clicked_signup: function(){
      this.msg_list = [];

      var flg = true;
      if(this.input_name == ""){this.msg_list.push("ユーザー名を入力してください");flg=false;}
      if(this.input_email == ""){this.msg_list.push("メールアドレスを入力してください");flg=false;}
      if(this.input_pass == ""){this.msg_list.push("パスワードを入力してください");flg=false;}
      if(this.input_pass2 == ""){this.msg_list.push("パスワード（確認用）を入力してください");flg=false;}
      if(this.input_pass != this.input_pass2 && flg == true){this.msg_list.push("パスワードが一致しません");flg=false;}

      if(flg){
        this.signup();
      }
    },
    signup: async function(){
      
      this.isLoading = true;
      const username = this.input_email;
      const password = this.input_pass;
      const name = this.input_name;
      try {
        await Auth.signUp({
          username,
          password,
          attributes: {
            name: name
          }
        });
        
        //成功
        this.$router.push({name:'confirm', query: {email:username}});
      } catch (error) {
        this.msg_list.push(error);
      }
      this.isLoading = false;
    }
  }
}
</script>