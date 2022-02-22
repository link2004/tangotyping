<template>
  <div class="h-100 flex-col">
    <b-container
    class="start-menu my-auto" 
    style="width:60%;"
    fluid>
      <div>
        <h1 class="mb-4"></h1>
        <div>
          <button
          class="btn btn-primary btn-block mb-2"
          style="font-size:2rem;"
          @click="$router.push({path:`../typing/${$route.params.id}`})">
            スタート (Enter)
          </button>
        </div>
        <div>
          <button
          class="edit-btn btn btn-secondary btn-block mb-2"
          @click="$router.push({name:'edit',params:{id:$route.params.id}})">
            編集
          </button>
        </div>
      </div>
    </b-container>
    <div class="text-left border-top pt-2">
      <div id="popover-copied" class="btn btn-info" @click="copyToClipboard"><i class="mr-1 bi bi-link-45deg"/>共有</div>
      <b-popover target="popover-copied" placement="top">リンクをコピーしました！</b-popover>
      
    </div>
  </div>
</template>
<script>
import "bootstrap-icons/font/bootstrap-icons.css"
export default {
  methods: {
    onKeyDown:function(e){
      if(e.key == "Enter" && this.$route.name=='start')this.$router.push({name:'typing',params:{id:this.$route.params.id}});
    },
    copyToClipboard() {
        var text = location.host + "/m/typing/" + this.$route.params.id;
        navigator.clipboard.writeText(text)
        .then(() => {
            console.log("copied!")
        })
        .catch(e => {
            console.error(e)
        })
    }
  },
  mounted() {
    document.addEventListener("keydown", this.onKeyDown);
  },
}
</script>
<style>
.flex-col{
  display:flex; 
  flex-direction: column;
}
</style>