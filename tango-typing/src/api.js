var xhr = new XMLHttpRequest();

function getQuestions(id){
  var item;
  
  xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
          item = JSON.parse(this.responseText);
      }
  }
  xhr.open(
      'GET',
      `https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/getquestionsdata?id=${id}`,
      false
  );
  xhr.send();
  return item
}


function deleteQuestions(token,tableID){
    var response,request;

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            response = JSON.parse(this.responseText);
        }
    }

    xhr.open(
        'POST',
        "https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/deletequestionsdata",
        false
    );

    request = {
        "userAuthorization": token,
        "tableID":tableID
    };

    xhr.send(JSON.stringify(request));
    return response;
}


function putQuestions(token,title,data){
    var response,request;

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            response = JSON.parse(this.responseText);
        }
    }

    xhr.open(
        'POST',
        "https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/putquestionsdata",
        false
    );

    request = {
        "userAuthorization": token,
        "title": title,
        "questions": data
    };

    xhr.send(JSON.stringify(request));
    return response;
}


function updateQuestions(token,title,data,tableID){
    var response,request;

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            response = JSON.parse(this.responseText);
        }
    }

    xhr.open(
        'POST',
        " https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/updatequestionsdata",
        false
    );

    request = {
        "userAuthorization": token,
        "title": title,
        "questions": data,
        "tableID":tableID
    };

    xhr.send(JSON.stringify(request));
    return response;
}


function signup(userID,pass){
    var response,request;

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            response = JSON.parse(this.responseText);
        }
    }
  
    xhr.open(
        'POST',
        "https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/signin",
        false
    );
  
    request = {
        "userID": userID,
        "pass": pass
    };
  
    xhr.send(JSON.stringify(request));
    return response;
}

function login(userID,pass){
  var response,request;

  xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
          response = JSON.parse(this.responseText);
      }
  }

  xhr.open(
      'POST',
      "https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/login",
      false
  );

  request = {
      "userID": userID,
      "pass": pass
  };

  xhr.send(JSON.stringify(request));
  return response;
}



function verification_token(token){
  var response, request;
  if (token == null)return null;

  xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
          response = JSON.parse(this.responseText);
      }
  }

  xhr.open(
      'POST',
      `https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/verificationtoken`,
      false
  );

  request = {
      "token":token
  }

  xhr.send(JSON.stringify(request));
  return response
}




function queryQuestion(userID){
    var response;

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            response = JSON.parse(this.responseText);
        }
    }

    xhr.open(
        'GET',
        `https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default/queryquestsion?userID=${userID}`,
        false
    );

    xhr.send();
    return response
}


export default {
  getQuestions,
  deleteQuestions,
  putQuestions,
  updateQuestions,
  signup,
  login,
  verification_token,
  queryQuestion
}
