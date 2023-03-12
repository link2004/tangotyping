import Amplify, { API, Auth } from 'aws-amplify'

Amplify.configure({
  Auth: {
    region: "ap-northeast-1",
    userPoolId: "ap-northeast-1_jFcnwkEnZ",
    userPoolWebClientId: "4bi70773qkp0je4ph7defj7j2s",
  },
  API: {
    endpoints: [
      {
        name: "default",
        endpoint: "https://dco3n4cfz7.execute-api.ap-northeast-1.amazonaws.com/default"
      }
    ]
  }
})

async function getQuestions(id) {
  var item;
  const apiName = "default";
  const path = "/getquestionsdata"
  const myInit = {
    queryStringParameters: {
      id: id,
    }
  }
  await API
    .get(apiName, path, myInit)
    .then(response => {
      item = response;
    })
    .catch(error => {
      item = error.response;
    })
  return item;
}

async function putQuestions(title, data) {
  var Response;
  const apiName = "default";
  const path = "/putquestionsdata";
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;
  const myInit = {
    headers: {
      Authorization: token
    },
    body: {
      "userID": user.attributes.email,
      "title": title,
      "questions": data
    }
  }
  await API
    .post(apiName, path, myInit)
    .then(response => {
      Response = response;
    })
    .catch(error => {
      Response = error.response;
    })
  return Response;
}

async function deleteQuestions(tableID) {
  var Response;
  const apiName = "default";
  const path = "/deletequestionsdata"
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;
  const myInit = {
    headers: {
      Authorization: token,
    },
    body: {
      "idtoken":token,
      "userID" : user.attributes.email,
      "tableID": tableID
    }

  }
  await API
    .post(apiName, path, myInit)
    .then(response => {
      Response = response;
    })
    .catch(error => {
      Response = error.response;
    })
  return Response;
}


async function updateQuestions(title, data, tableID) {
  var Response;
  const apiName = "default";
  const path = "/updatequestionsdata"
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;
  const myInit = {
    headers: {
      Authorization: token,
    },
    body: {
      "userID" : user.attributes.email,
      "title" : title,
      "questions": data,
      "tableID": tableID
    }
  }
  await API
    .post(apiName, path, myInit)
    .then(response => {
      Response = response;
    })
    .catch(error => {
      Response = error.response;
    })

  return Response;
}



async function queryQuestion() {
  var item;
  const apiName = "default";
  const path = "/queryquestsion";
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;
  const myInit = {
    headers: {
      Authorization: token
    },
    queryStringParameters: {
      userID: user.attributes.email,
    }
  }
  await API
    .get(apiName, path, myInit)
    .then(response => {
      item = response;
    })
    .catch(error => {
      item = error.response;
    })
  return item;
}


export default {
  getQuestions,
  deleteQuestions,
  putQuestions,
  updateQuestions,
  queryQuestion
}
