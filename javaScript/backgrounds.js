//ob4ganei7br3knkju3b5udrc2nvg6f25eckb6glhyt57lifrlnwq
//http://localhost:8080/
async function run(){
    console.log("running...");
    const config = {
        auth: {
            clientId: 'cd893e7a-6b16-4ea8-be19-2915831372bc',
            authority: 'https://login.microsoftonline.com/common/',
            redirectUri: 'http://localhost:8080/'
        },
    };
    var client = new Msal.PublicClientApplication(config);
    var request = {
        scopes: ['user.read']
    };
    let loginResponse = await client.loginPopup(request);
    console.log(loginResponse);
}
var code = "console.log('This code will execute as a content script');";
//chrome.tabs.executeScript({code: document.getElementById('signIn').addEventListener('click',run)});

document.getElementById('signIn').addEventListener('click',run);


