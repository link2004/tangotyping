<template>
  <div id="app">
    <header>
      <b-navbar toggleable="lg" type="light" variant="light">
        <b-navbar-brand to="/">TangoTyping</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>    
          <b-navbar-nav style="margin-left:auto">
            <b-nav-item to="login" v-if="!isLogined">ログイン</b-nav-item>
            <b-nav-item-dropdown v-if="isLogined" right>
              <template #button-content>
                <em>ユーザー</em>
              </template>
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
nav{
  padding:20px
}
</style>
