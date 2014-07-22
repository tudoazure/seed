// /*
//     Project         :Jarvis
//     Module          :JS file for Chat SDK
//     Source file name:ChatSDK.js
//     Description     :Chat SDK. 
//     Written By      :Mahesh Kumar G
//     Copyright       :Copyright © 2012, paytm. Written under contract by Robosoft Technologies Pvt. Ltd.
//     History         :
// */
// /*
//  *Defeine data structure for LocalCache
//  */
// var coreAPI = {
//     jsonresult:null,     
//     getAPIResult:function(inurl,inpostdata)
//     {
//         //alert('called');
//       RoboSDK.jqueryStore= jQuery.ajax({
//             url:inurl,
//             type: "POST",
//             data: inpostdata,
//             chache :false,
//             async: false,
//             //
//             dataType: "json",
//             crossDomain: true,

//             //------------------------No need to include--- 
//             //headers: {
//             //    'User-Agent': 'Plustxt-web'
//             //},
//             //contentType: "text/html",
//             //----------------------------------------------
//             wait: true,
//             success: function(data) {
               
//                 coreAPI.jsonresult=data;
                
//               //  alert(' sucess from getAPI'+data);
//             },
//             complete: function (xhr, status) {
//                 if (status === 'error' || !xhr.responseText) {
//                  //   alert('complete called'+xhr.responseText+'status' + status);
//                 }
//                 else {
//                     var data =JSON.stringify(xhr.responseText);    
//                     JSON.stringify(data);
//                 }
//             },
//             error: function(data1,data2,data3) {
//                 //alert('in error1->'+JSON.stringify(data1.responseText)+ 'data1.status'+data1.status + ' message'+data1.message);
//                 //alert('in error2->'+JSON.stringify(data2));
//                 //alert('in error2->'+JSON.stringify(data3));
//                 var obj={};
//                 obj['status']=1;
//                 obj['message']='Response Code '+data1.status+ ' Internal Server Error';
//                 coreAPI.jsonresult=obj;
//                // alert(' error  from getAPI');
//             //  console.log(" error returned" + JSON.stringify(data));
//             }
//         }); 
//        // alert('json result from getresult ' + coreAPI.jsonresult);
//         return coreAPI.jsonresult;
//     }
// };
// /*
// //-------------- Signup API -------------------------------    
// var signupurl="https://cs.plustxt.com/accounts/signup/";
// var signupdata="first_name=Mahesh&last_name=kumar&email=mahesh.robosoft%40gmail.com&password1=Closed123&password2=Closed123&country_code=%2B91&phone=9449256332&device_id=Dev-12345&device_type=Android&device_detail=none+details&device_token=TOKEN&utype=Normal";
// //clicked(signupurl,signupdata,jsonresult);

// //-------------- Login API ------------------------------- 
// var loginurl="https://cs.plustxt.com/accounts/login/";
// var logindata="email=mahesh.robosoft%40gmail.com&password=password&device_id=1234&device_type=Android&device_detail=none+details&device_token=TOKEN";
// //clicked(loginurl,logindata,jsonresult);

// //-------------- Update Device Info ------------------------------- 
// var updatedeviceinfourl="https://cs.plustxt.com/accounts/update-device-info/";
// var updatedeviceinfodata="email=mahesh.robosoft%40gmail.com&password=password&device_type=Android&device_detail=none+details&device_token=TOKEN&device_id=1234";
// //clicked(updatedeviceinfourl,updatedeviceinfodata,jsonresult);
// //alert(jsonresult);
// //-------------- Update Account Info ------------------------------- 
// var updateaccountinfourl="https://cs.plustxt.com/accounts/update-account-info/";
// var updateaccountinfodata="first_name=Mahesh&last_name=Kumar&country_code=%2B91&phone=9449256332&session_id="+LocalCache.sessionid;
// //clicked(updateaccountinfourl,updateaccountinfodata,jsonresult);
// */

// //coreAPI.getAPIResult(inurl, inpostdata)

