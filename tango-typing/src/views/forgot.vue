<template>
  <div class="container text-center" style="padding: 20rem 0rem;">
    <div class="card mx-auto shadow input-form">
      <div class="card-body">
        <h5 class="card-title">パスワードリセット</h5>
        <div class="text-left">
          <label for="email">メールアドレス</label>
          <input type="email" class="form-control" id="email" v-model="input_email" :disabled="isSuccess">
        </div>
        <div v-for="(msg,key) in msg_list" class="text-danger" :key="key">{{msg}}</div>
        <button @click="Clicked_submit" class="btn btn-primary btn-block" :disabled="isLoading" v-if="!isSuccess">
          <div v-show="isLoading">Loading...</div>
          <div v-show="!isLoading">確認コードを送信</div>
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
      input_newPass:"",
      msg_list: [],
      isLoading: false,
      isSuccess: false,
    }
  },
  methods: {
    Clicked_submit: function(){
      this.msg_list = [];

      var flg = true;
      if(this.input_email == ""){this.msg_list.push("メールアドレスを入力してください");flg=false;}

      if(flg){
        this.sendConfirmCode();
      }
    },
    sendConfirmCode: async function(){
      try {
        await Auth.forgotPassword(this.input_email);

        //success
        this.$router.push({name:"reset", query: {email:this.input_email}})
      } catch (error) {
        this.msg_list.push(error);
      }
    },
  },
  mounted: function(){
    if(this.$route.query.email)this.input_email = this.$route.query.email;
  }
}
</script>