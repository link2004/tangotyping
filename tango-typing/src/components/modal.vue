<template>
  <div>
    <b-modal
    :visible="true"
    id="typing-modal"
    size="lg"
    centered ok-only 
    ok-title="閉じる"
    button-size="sm"
    no-close-on-esc
    @hidden="ClosedModal">
    <template #modal-title>
      <h2>{{title}}</h2>
    </template>
    <div style="height:30rem">
      <router-view/>
    </div>
    <template #modal-footer>
      <b-button size="sm" variant="secondary" v-if="$route.name=='edit'" @click="Return">
        戻る
      </b-button>
      <b-button size="sm" variant="primary" v-if="$route.name=='typing'" @click="Return">
        最初から (Esc)
      </b-button>
    </template>
    </b-modal>
  </div>
</template>

<script>
import api from "../api.js"

export default {
  data() {
    return {
      title: "",
      isBtnRestart: false
    }
  },
  methods: {
    ClosedModal: function () {
      this.$router.push({name:'mypage'});
    },
    Return: function(){
      this.$router.push({name:'start',params:{id:this.$route.params.id}});
    },
  },
  mounted() {
    var response = api.getQuestions(this.$route.params.id);
    this.title = response.body.title;
  },
  
}
</script>

<style>
.modal-footer{
  justify-content: flex-start;
}
</style>