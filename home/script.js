import api from "./api.js";
const URL_LOGIN_ID = "/login";
const URL_GAME_ID = "/TypingGame";

var vue  = new Vue({
    el: "#app",
    data: {
        isLogined: false,
        userID: "",
        questions: []
    },
    methods: {
        locate: function(){
            location.href =  URL_LOGIN_ID;
        },
        ClickedQuestion: function(title){
            var request = "?userID=" + this.userID + "&title=" + title + "&token=" + api.getParam('token');
            location.href =  URL_GAME_ID + request;
        }
    },
    mounted: function(){
        var response = api.verification_token();
        if(response.isSuccess){
            this.isLogined = true;
            this.userID = response.Item.sub;
            var items = api.queryQuestion(this.userID).questions;
            for (var item in items){
                this.questions[item] = {"title":items[item]};
            }
            console.log(this.questions)
        }
    }
});