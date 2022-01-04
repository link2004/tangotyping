import api from "./api.js";
const URL_LOGIN_ID = "/login";

var vue  = new Vue({
    el: "#app",
    data: {
        isLogined: false,
        userID: ""
    },
    methods: {
        locate: function(){
            location.href =  URL_LOGIN_ID;
        }
    },
    mounted: function(){
        var response = api.verification_token();
        if(response.isSuccess){
            this.isLogined = true;
            this.userID = response.Item.sub
        }
    }
});