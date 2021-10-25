var questions

function getQuestions(){
    var userID = "riku0720"
    var title = "Fruit"
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

export default {
    getQuestions,
}
