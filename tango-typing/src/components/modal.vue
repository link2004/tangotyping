<template>
  <div>
    <b-modal
    :visible="true"
    id="typing-modal"
    size="lg"
    ok-title="閉じる"
    no-close-on-esc
    no-close-on-backdrop
    hide-footer
    centered
    header-bg-variant="light"
    @hidden="ClosedModal">
    <template #modal-title>
      <h2>{{title}}</h2>
    </template>
    <div style="height:30rem">
      <router-view/>
    </div>
    </b-modal>
  </div>
</template>

<script>
import api from "../api.js"

export default {
  data() {
    return {
      title: "",
      isBtnRestart: false,
      is_loading_successful: false
    }
  },
  methods: {
    ClosedModal: function () {
      this.$router.push({path:"../../"});
    },
  },
  mounted: async function(){
    var response = await api.getQuestions(this.$route.params.id);
    const tableIDisExist = response.statusCode == 200;
    //tableIDが存在するか判定
    if(tableIDisExist){
      this.title = response.body.title;
      this.is_loading_successful = true;
      //本人確認
      if(response.body.userID != this.email){
        this.$router.push({path:`/m/typing/${this.$route.params.id}`});
      }
      
    }else{
      this.title = "新規作成";
    }

  },
  computed:{
    email () {
      return this.$store.state.user.attributes.email
    }
  }
  
}
</script>

<style>
.modal-footer{
  justify-content: flex-start;
}
</style>