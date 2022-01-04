function getQuestions(){
    var questions
    console.log("title:",getParam('title'))
    var userID = "riku0720"
    var title = "Fruit"
    if (getParam('title') != null) title = getParam('title');
    if (getParam('userID') != null) userID = getParam('userID')
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var item = JSON.parse(this.responseText);
            console.log(item);
            questions = item.questions;
        }
    }
    xmlHttpRequest.open(
        'GET',
        `https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/getquestionsdata?userID=${userID}&title=${title}`,
        false
    );
    //https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/getquestionsdata?userID=riku0720&title=testData
    //xmlHttpRequest.setRequestHeader("Content-Type", "application/json")
    //xmlHttpRequest.setRequestHeader("Authorization","A4CpxKmKOj2De7gGuAbSZ5fx0jT87raP1SQV0jO1");
    xmlHttpRequest.send();
    return questions
}

//getパラメータを取得
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default {
    getQuestions,
    getParam
}
