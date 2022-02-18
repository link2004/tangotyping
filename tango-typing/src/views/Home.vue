<template>
  <div class="about">
    <h1>Home</h1>
    <button @click=ClickedQuestion>modal</button>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  methods:{
    ClickedQuestion: function(){
      this.$router.push({
        path:'m/typing/10e36549-3657-46a0-b3be-776375e91044',
      })
    },
  }
}
</script>