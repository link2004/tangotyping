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
  mounted() {
    var response = api.getQuestions(this.$route.params.id);
    if(response.statusCode==200){
      this.title = response.body.title;
      this.is_loading_successful = true;
    }else{
      this.title = "新規作成";
    }

  },
  
}
</script>

<style>
.modal-footer{
  justify-content: flex-start;
}
</style>