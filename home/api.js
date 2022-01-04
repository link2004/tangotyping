function verification_token(){
    var response, request;
    var token = getParam('token');
    if (token == null)return null;
    var xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            response = JSON.parse(this.responseText);
            console.log(response);
        }
    }
    xmlHttpRequest.open(
        'POST',
        `https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/verificationtoken`,
        false
    );
    //https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/getquestionsdata?userID=riku0720&title=testData
    //xmlHttpRequest.setRequestHeader("Content-Type", "application/json")
    //xmlHttpRequest.setRequestHeader("Authorization","A4CpxKmKOj2De7gGuAbSZ5fx0jT87raP1SQV0jO1");

    request = {
        "token":token
    }

    xmlHttpRequest.send(JSON.stringify(request));
    return response
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
    verification_token
}
