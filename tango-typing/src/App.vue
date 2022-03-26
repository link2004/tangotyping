<template>
  <div id="app">
    <header>
      <b-navbar toggleable="lg"  class="border-bottom">
        <b-navbar-brand to="/">TangoTyping</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>    
          <b-navbar-nav class="ml-auto" v-if="!user">
            <b-nav-item to="login" class="my-auto">ログイン</b-nav-item>
            <b-nav-item>
              <b-button to="signup" size="sm" variant="outline-primary">新規登録</b-button>
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto" v-if="user">
            <b-nav-item-dropdown :text="user.attributes.name" right>
              <b-dropdown-item href="#" to="/mypage">マイページ</b-dropdown-item>
              <b-dropdown-item href="#" @click="signOut">サインアウト</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>  
        </b-collapse>
      </b-navbar>
    </header>
    
    <div class="main">
      <div class="container">
        <router-view/>
      </div>
    </div>
    

    <footer>
      <b-navbar toggleable="lg" class="border-top">
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/terms">利用規約</b-nav-item>
          <b-nav-item to="/policy">プライバシーポリシー</b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </footer>
  </div>
</template>

<script>
import store from './store'
import { Auth } from 'aws-amplify'
export default {
  methods: {
    signOut: async function(){
      await Auth.signOut();
      this.$router.push({name:"login"});
    }
  },
  computed: {
    user () {
      return store.state.user
    }
  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.input-form {
  max-width: 25rem;
  border-radius: 0.5rem;
}
.form-control{
  margin-bottom:1rem;
}

.main{
  background-color:rgb(243, 243, 243);
}
nav{
  padding:20px
}

</style>
