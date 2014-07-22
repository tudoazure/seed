
module.exports = {
 clientKey: 'market-staging', //String Client Identifier
 clientSecret: 'ca602054-b774-4d64-8478-cecc19b39852', // String Client Secret
 endpoint: 'https://accounts-uat.paytm.com', // String Base url of OAuth request
 authUrl: '/oauth2/authorize', // String Optional; Authorization endpoint, default is /oauth/authorize
 authMethod: 'GET', // String Optional; Authorization Header Method, default is Bearer
 accessTokenUrl: '/oauth2/token', // String Optional; Access Token Endpoint, default is /oauth/access_token
 accessTokenName: 'session_token', //String Optional; Access Token Parameter Name, default is access_token
 headers: {
   Authorization: 'basic bWFya2V0LXN0YWdpbmc6Y2E2MDIwNTQtYjc3NC00ZDY0LTg0NzgtY2VjYzE5YjM5ODUy',
 }
};
