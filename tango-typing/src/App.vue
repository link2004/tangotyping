<template>
  <div id="app">
    <header>
      <b-navbar toggleable="lg" type="light" variant="light" class="border-bottom shadow-sm">
        <b-navbar-brand to="/">TangoTyping</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>    
          <b-navbar-nav class="ml-auto" v-if="!isLogined">
            <b-nav-item to="login" class="my-auto">ログイン</b-nav-item>
            <b-nav-item>
              <b-button to="signup" size="sm" variant="outline-primary">新規登録</b-button>
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto" v-if="isLogined">
            <b-nav-item-dropdown :text="this.userID" right>
              <b-dropdown-item href="#" to="/">マイページ</b-dropdown-item>
              <b-dropdown-item href="#" @click="Logout">ログアウト</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>  
        </b-collapse>
      </b-navbar>
    </header>
    
    <div id="body"><router-view/></div>
    
  </div>
</template>

<script>
import api from './api.js'
export default {
  data() {
    return {
      userID: "",
      isLogined: false,
      token: "",
    }
  },
  methods: {
    Logout: function(){
      this.$cookies.set('LoginToken',null);
      this.$router.go(this.$router.currentRoute);
    },
    Login: function(){
      this.token = this.$cookies.get('LoginToken');
      if(this.token!="null"){
        var response = api.verification_token(this.token);
        if(response.isSuccess){
          this.$cookies.set('LoginToken',this.token);
          this.isLogined = true;
          this.userID = response.Item.sub;
        }
      }
    } 
  },
  mounted: function(){
    this.Login();
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

#body {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.input-form {
  max-width: 25rem;
  border-radius: 0.5rem;
}
.form-control{
  margin-bottom:1rem;
}
nav{
  padding:20px
}
</style>
