const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolData = {
  UserPoolId : "ap-northeast-1_v9Uji8Aja",
  ClientId : "4n5j1pk009vjuve7p8ht4kgm6h"
}
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var attributeList = [];

/**
 * サインアップ処理。
 */
var signUp = async function(email,name,password) {
			
	// 何か1つでも未入力の項目がある場合、処理終了
  if (!email | !name | !password) { 
    return false; 
  }
	
    // ユーザ属性リストの生成
	var dataEmail = {
		Name : "email",
		Value : email
	}

  var dataUserName = {
    Name: "name",
    Value : name
  }

	var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
	var attributeUserName = new AmazonCognitoIdentity.CognitoUserAttribute(dataUserName);
  attributeList.push(attributeEmail);
  attributeList.push(attributeUserName);
			
  // サインアップ処理
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, function(err){
      if (err) {
        alert(err);
        reject(false);
      } else {
        // サインアップ成功
        resolve(true);
      }
    });
  })
}

var signIn = async function(email,password){
  //何か1つでも未入力の項目がある場合、処理終了
  if(!email | !password){
    return false;
  }

  //認証データの作成
  var authenticationData = {
    email: email,
    Password: password
  }
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  
  var userData = {
    Username: email,
    Pool : userPool
  }
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  //認証処理
  return new Promise((resolve,reject)=>{
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result){
        var idToken = result.getIdToken().getJwtToken();
        var accessToken = result.getAccessToken().getJwtToken();
        var refreshToken = result.getRefreshToken().getToken();
  
        console.log("idToken : " + idToken);
        console.log("accessToken : " + accessToken);
        console.log("refreshToken : " + refreshToken);
        resolve(true);
      },
      onFailure: function(err){
        console.log(err);
        reject(false);
      }
    });
  });
}

var activate = async function(email,activationKey){
  if(!email | !activationKey){
    return false;
  }
  var userData = {
    Username : email,
    Pool : userPool
  }
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  return new Promise((resolve,reject)=>{
    cognitoUser.confirmRegistration(activationKey, true, function(err){
      if (err){
        alert(err);
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
}

export default {
  signUp,
  signIn,
  activate
}