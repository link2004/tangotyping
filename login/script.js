import api from "./api.js";
const URL_HOME_ID = "/home";

var vue  = new Vue({
  el: "#app",
  data: {
      input_userID:"",
      input_pass:"",
      token:""
  },
  methods: {
    login: function(){
        var response = api.login(this.input_userID,this.input_pass);
        if(response.isSuccess){
            this.token = response.Item.token;
            location.href =  URL_HOME_ID + "?token=" + this.token;
        }
    }
  }
});