var token;

var url_ = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=cd893e7a-6b16-4ea8-be19-2915831372bc&response_type=code&redirect_uri=https://ffohjlmjnkompiclleddcinkjpggfcce.chromiumapp.org/&response_mode=query&scope=openid&state=12345&code_challenge=ba7_E-fgqBkkwBtm2ohMpMbmn5M2v5SO2ZND-c77dBY&code_challenge_method=S256';
function run(){
  chrome.identity.launchWebAuthFlow({
    url: url_,
    interactive: true,
  }, function(redirectURL) {
    var url = new URL(redirectURL);
    var code = new URLSearchParams(url.search).get('code');
    console.log(code);
    getAuthToken(code);
  });
};
//window.onload = run();
function getAuthToken(code_get) {
  var data = {
    grant_type: "authorization_code",
    clientid : "cd893e7a-6b16-4ea8-be19-2915831372bc",
    scope: "openid",
    code: code_get,
    redirect_uri: "https://ffohjlmjnkompiclleddcinkjpggfcce.chromiumapp.org/",
    client_secret: "4369fed0-7d3e-4c35-9d9d-1415caaedc88"

  };
  fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
  method: "POST",
  body: "grant_type=authorization_code&client_id=cd893e7a-6b16-4ea8-be19-2915831372bc&code="+code_get+"&redirect_uri=https://ffohjlmjnkompiclleddcinkjpggfcce.chromiumapp.org/&code_verifier=Vpix.k2rM_nOHTdw0oJe9y798o~RZzXa7bekBskoDX3feL9Fl6yf1UZxvBQ1kmAQS3RS2uJYce7z9698kTQKxW0r6WBXNfVb.NxPcAYyXIiXx0nm273pkvq1HzoGQ-Mu",
  headers: {"Content-type": "application/x-www-form-urlencoded","Origin": "https://ffohjlmjnkompiclleddcinkjpggfcce.chromiumapp.org/"}
})
.then(response => response.json()) 
.then(json => {
   token = json.access_token;
  switchPage(1);
  chrome.storage.sync.get('myTable',function(data){
    tableEL.innerHTML = data.myTable;
  });
  //fetch_data(token);
})
.catch(err => console.log(err));

};
function fetch_data(token,orgName,projName) {
  const apiConfig = {
    endpoint: "https://dev.azure.com/"+orgName+"/"+projName+"/_apis/wit/workitems?ids=2&api-version=6.0",
    scopes: ["499b84ac-1321-427f-aa17-267ca6975798/.default"] // do not change this value
};
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  headers.append("Authorization", bearer);
  const res  = { query: "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.WorkItemType] = 'Bug' order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc"};
  const options = {
      method: "GET",
      headers: headers,
  };
  //logMessage('Calling web API...');
  fetch(apiConfig.endpoint, options)
      .then(response => response.json())
      .then(response => {
          console.log(response);
      }).catch(error => {
          console.error(error);
      });

}

//event listener for sign in
var signIn =  document.getElementById('signIn');
if(signIn){
  signIn.addEventListener('click',run);
}

function switchPage(x){
  const show = (selector) => {
      document.querySelector(selector).style.display = 'block';
    };
    
    // Hide an element
    const hide = (selector) => {
      document.querySelector(selector).style.display = 'none';
    };
  
    if (x==1) {//add condition for token here, doubt: how to use class name as parameter
      hide('.initial');
      show('.selectProject');
    }
    else if (x==2){
        hide('.selectProject');
        show('.displayTasks');
    }
    else if (x==3){
      hide('.displayTasks');
      show('.selectProject');
    }
    else{
      hide('.displayTasks');
      show('.initial');
    }
}

var addProj =  document.getElementById('addProj');
if(addProj){
  addProj.addEventListener('click',addProject);
}

function addProject(){
  const tbodyEl = document.querySelector('tbody');
  var org = document.getElementById('org').value;
  var proj = document.getElementById('proj').value;

  let template = `
                <tr>
                    <td>${org}</td>
                    <td>${proj}</td>
                    <td><button class='callAPI'>Call API</button> <br> <button class='deleteProj'>Delete</button></td>
                </tr>`;

  tbodyEl.innerHTML += template ;

  chrome.storage.sync.set({'myTable': tableEL.innerHTML});
}

const tableEL = document.querySelector('table');
if(tableEL){
  tableEL.addEventListener('click',tableClick);
}


function tableClick(e) {
  if(e.target.classList.contains("callAPI")){
    var rowIndex = e.path[0].parentNode.parentNode.rowIndex;
    var orgName = tableEL.rows[rowIndex].cells[0].innerHTML
    var projName = tableEL.rows[rowIndex].cells[1].innerHTML
    console.log(tableEL.rows[rowIndex].cells[0].innerHTML);
    console.log(tableEL.rows[rowIndex].cells[1].innerHTML);
    fetch_data(token,orgName,projName);
    switchPage(2);
  }
  if (e.target.classList.contains("deleteProj")) {
    const btn = e.target;
    btn.closest("tr").remove();
  }

  chrome.storage.sync.set({'myTable': tableEL.innerHTML});
}

