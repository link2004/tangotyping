function login(userID,pass){
    var response;
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            response = JSON.parse(this.responseText);
            console.log(response);
        }
    }
    
    xhr.open(
        'POST',
        "https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/login",
        false
    );
    var request = {
        "userID": user1,
        "pass": pass
      }
    //xmlHttpRequest.setRequestHeader("Content-Type", "application/json")
    //xmlHttpRequest.setRequestHeader("Authorization","A4CpxKmKOj2De7gGuAbSZ5fx0jT87raP1SQV0jO1");
    console.log("userID:",userID,"pass:",pass);
    xhr.send(JSON.stringify(request));
    return response;
};

export default {
    login
}
