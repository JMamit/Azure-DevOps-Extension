var AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=6731de76-14a6-49ae-97bc-6eba6914391e&response_type=code&redirect_uri='+chrome.identity.getRedirectURL+'&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=12345';
var CALLBACK_URL =  'https://' + chrome.runtime.id +
'.chromiumapp.org/provider_cb';
chrome.identity.launchWebAuthFlow({
    url: AUTH_URL,
    interactive: true,
  }, function(redirectURL) {
    var q = redirectURL.substr(redirectURL.indexOf('#')+1);
    var parts = q.split('&');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      if (kv[0] == 'access_token') {
        token = kv[1];
        console.log('token is', token);
      }
    }
  });