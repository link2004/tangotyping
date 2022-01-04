const URL_LOGIN_ID = "/login";

var vue  = new Vue({
  el: "#app",
  data: {
      isLogined: false,
  },
  methods: {
      locate: function(){
          location.href =  URL_LOGIN_ID;
      }
  }
});