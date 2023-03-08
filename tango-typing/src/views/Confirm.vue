<template>
  <div class="container text-center" style="padding: 12.8rem 0rem;">
    <div class="card mx-auto shadow input-form">
      <div class="card-body">
        <h5 class="card-title">メール確認</h5>
        <div class="text-left">
          <label for="email">メールアドレス</label>
          <input type="email" class="form-control" id="email" v-model="input_email" :disabled="isSuccess">
          <label for="code">確認コード</label>
          <input type="text" class="form-control" id="code" v-model="input_code" :disabled="isSuccess">
        </div>
        <div class="text-left mb-2">
          <a class="text-primary" @click="resendConfirmationCode" v-if="!isSuccess">コードを再送信</a>
        </div>
        <div v-for="(msg,key) in msg_list" class="text-danger" :key="key">{{msg}}</div>
        <button @click="Clicked_signup" class="btn btn-primary btn-block" :disabled="isLoading" v-if="!isSuccess">
          <div v-show="isLoading">Loading...</div>
          <div v-show="!isLoading">送信</div>
        </button>
        <div v-if="isSuccess">
          確認が完了しました
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
      msg_list: [],
      isLoading: false,
      isSuccess: false,
    }
  },
  methods: {
    Clicked_signup: function(){
      this.msg_list = [];

      var flg = true;
      if(this.input_code == ""){this.msg_list.push("認証コードを入力してください");flg=false;}
      if(this.input_email == ""){this.msg_list.push("メールアドレスを入力してください");flg=false;}

      if(flg){
        this.confirmSignUp();
      }
    },
    confirmSignUp: async function(){
      this.isLoading = true;
      try {
        await Auth.confirmSignUp(this.input_email,this.input_code);
        this.isSuccess = true;
      } catch (error) {
        this.msg_list.push(error);
      }
      this.isLoading = false;
    },
    resendConfirmationCode: async function(){
      try {
        await Auth.resendSignUp(this.input_email);
        this.msg_list.push("再送信しました");
      } catch (error){
        this.msg_list.push("送信できませんでした");
      }
    }
  },
  mounted: function(){
    this.input_email = this.$route.query.email;
    this.activationKey = this.$route.query.code;
  }
}
</script>