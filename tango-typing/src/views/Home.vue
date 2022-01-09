<template>
<div id="app" class="container text-center mt-5">
  <div v-show="!isLogined" v-cloak>
      <router-link to="login" class="btn btn-primary">ログイン</router-link>
  </div>

  <div v-show="isLogined" v-cloak>
    <p>{{userID}}</p>
    <div class="card">
      <div class="card-body" id="table">
        <table class="table table-bordered table-sm">
          <tbody>
            <tr v-for="(question,key) in questions" :key=key>
              <td>
                <router-link :to="{name:'typing',params:{id:question.id}}">
                  {{question.title}}
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import api from '../api.js'
export default {
  props:{
    token: String
  },
  data() {
    return {
      isLogined: false,
      userID: "",
      questions: []
    }
  },
  mounted: function(){
    if(this.token==null)return;
    var response = api.verification_token(this.token);
    if(response.isSuccess){
      this.isLogined = true;
      this.userID = response.Item.sub;
      var items = api.queryQuestion(this.userID).questions;
      for (var item in items){
        this.questions[item] = {
          "title":items[item].title,
          "id":items[item].id
        };
      }
    }
  }
}
</script>
