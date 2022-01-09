<template>
  <div id="app">
    <div id="header">
      <h1 id="title">Tango Typing</h1>
      <div class="title-bar"></div>
    </div>
    <div id="body"><router-view/></div>
    
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#title {
  margin: 20px;
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
.title-bar {
  height: 2px;
  background-color: #e9ecef;
}
</style>
