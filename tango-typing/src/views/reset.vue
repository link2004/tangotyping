<template>
  <div class="container text-center" style="padding: 12.8rem 0rem;">
    <div class="card mx-auto shadow input-form">
      <div class="card-body">
        <h5 class="card-title">パスワードリセット</h5>
        <div class="text-left">
          <label for="email">メールアドレス</label>
          <input type="email" class="form-control" id="email" v-model="input_email" :disabled="isSuccess">
          <label for="code">確認コード</label>
          <input type="text" class="form-control" id="code" v-model="input_code" :disabled="isSuccess">
          <label for="pass">新しいパスワード</label>
          <input type="password" class="form-control" id="pass" v-model="input_newPass" :disabled="isSuccess">
          <label for="pass2">新しいパスワード(確認)</label>
          <input type="password" class="form-control" id="pass2" v-model="input_newPass2" :disabled="isSuccess">
        </div>
        <div class="text-left mb-2">
          <router-link class="text-primary" :to="{name:'forgot', query:{email:input_email}}" v-if="!isSuccess">コードを再送信</router-link>
        </div>
        <div v-for="(msg,key) in msg_list" class="text-danger" :key="key">{{msg}}</div>
        <button @click="Clicked_submit" class="btn btn-primary btn-block" :disabled="isLoading" v-if="!isSuccess">
          <div v-show="isLoading">Loading...</div>
          <div v-show="!isLoading">送信</div>
        </button>
        <div v-if="isSuccess">
          パスワードを変更しました
         <button class="btn btn-primary btn-block" @click="$router.push({name:'login', query: {email:input_email}})">ログイン</button>
        </div>
      </div>
      
    </div>
  </div>
</template>
<script>
import { Auth } from 'aws-amplify'
export default {
  data() {
    return {
      input_code:"",
      input_email:"",
      input_newPass:"",
      input_newPass2:"",
      msg_list: [],
      isLoading: false,
      isSuccess: false,
    }
  },
  methods: {
    Clicked_submit: function(){
      this.msg_list = [];

      var flg = true;
      if(this.input_code == ""){this.msg_list.push("認証コードを入力してください");flg=false;}
      if(this.input_email == ""){this.msg_list.push("メールアドレスを入力してください");flg=false;}
      if(this.input_newPass == ""){this.msg_list.push("新しいパスワードを入力してください");flg=false;}
      if(this.input_newPass2 == ""){this.msg_list.push("新しいパスワード(確認)を入力してください");flg=false;}
      if(this.input_newPass && this.input_newPass2 && this.input_newPass != this.input_newPass2){
        this.msg_list.push("パスワードが一致しません");flg=false;
      }

      if(flg){
        this.submit();
      }
    },
    submit: async function(){
      try {
        await Auth.forgotPasswordSubmit(this.input_email, this.input_code, this.input_newPass);
        this.isSuccess = true;
      } catch (error){
        this.msg_list.push(error);
      }
    }
  },
  mounted: function(){
    this.input_email = this.$route.query.email;
    this.activationKey = this.$route.query.code;
  }
}
</script>