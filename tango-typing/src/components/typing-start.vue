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
          class="btn btn-primary btn-block mb-3"
          style="font-size:1.7rem;"
          @click="$router.push({name:'typing',params:{id:$route.params.id}})">
            スタート (Enter)
          </button>
        </div>
        <div>
          <button
          class="edit-btn btn btn-secondary btn-block"
          @click="$router.push({name:'edit',params:{id:$route.params.id}})">
            編集
          </button>          
        </div>
      </div>
    </b-container>
  </div>
</template>
<script>
export default {
  methods: {
    onKeyDown:function(e){
      if(e.key == "Enter" && this.$route.name=='start')this.$router.push({name:'typing',params:{id:this.$route.params.id}});
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