
// var ProgresBar = {
//     showProgressvalue : "",
//     disableProgressValue :"none",
//     continueLogin :"No"
// };
/* 
 function                : on_Roster_Changed_Update_Contact()
 parameters              : JSON object
 parameter description   : This object conatins subscription,jid ,other additional attribute, name
 function description    : Used to update the roster-contact new new contact
 : When contact information comes, this fucntion will create a li element and
 append the exiting ul element. If conact already exit, based on the priority,it sort 
 contact insert it into ul .If Subsritpion is remove the remove the contact 
 from the ul
 
 */
function on_Roster_Changed_Update_Contact(JsonResponse)
{
    var contact;
    // console.log(' on_roster_Get_Contact(JsonResponse)' + JSON.stringify(JsonResponse))
    //  alert(JSON.stringify(JsonResponse));
    // iterate each  contact in JSON Object
    var Result = getAllRosters();
    for (contact in JsonResponse)
    {

        var sub = JsonResponse[contact]['sub'];
        var jid = JsonResponse[contact]['jid'];
        var name = JsonResponse[contact]['name'];
        var jid_id = RoboSDK.jid_to_id(jid);
        RoboSDK.nameList[jid_id] = name;
        RoboSDK.write_to_log('on_roster_changed called subscription ' + sub + '  jid ' + jid + ' name ' + name + 'jid_id ' + jid_id);
        // if Subsription is remove ,
        if (sub === 'remove') {
            // contact is being removed
            // remove the element frmo ul.
            $('#' + jid_id).remove();
        } else {
            console.log($('#' + jid_id).children().attr('class'));
            // contact is being added or modified
            
            var tigo_id = Strophe.getNodeFromJid(jid);
            console.log("Result -> "+ JSON.stringify(Result)+" tigoid "+tigo_id);
            var username = Result[tigo_id]['username'];
            var contact_html = $("<li id='" + jid_id + "'>" +
                    "<div class='" +
                    ($('#' + jid_id).children().attr('class') || "roster-contact offline") +
                    "'>" +
                    "<div class='roster-name'>" +
                    name +
                    "</div><div class='roster-jid hiddenClass2'>" +
                    jid +
                    "</div><div class='username'>" +
                    username +
                    "</div></div></li>");
            // If contatc already exist replace the old one 
            if ($('#' + jid_id).length > 0) {
                RoboSDK.write_to_log('on_roster_changed called subscription ' + sub + '  jid ' + jid + ' name ' + name + 'jid_id ' + jid_id + 'contact replaced ');
                $('#' + jid_id).replaceWith(contact_html);
            } else {
                // Insert the conatct sine , contact is not existing .
                RoboSDK.write_to_log('on_roster_changed called subscription ' + sub + '  jid ' + jid + ' name ' + name + 'jid_id ' + jid_id + 'contact added ');
                RoboSDK.insert_contact(contact_html);
            }
        }
    }
}
/* 
 function                : insert_Contact_Info()
 parameters              : html component li.
 parameter description   : 
 function description    : Used to insert the new contact to ul
 : Based on the priority of contacts , this function will insert the 
 contact into ul element. Internally it call sort-helper function for determine 
 priority of the contact.
 
 */

function insert_Contact_Info(elem) {

    var jid = elem.find('.roster-jid').text();
    var pres = RoboSDK.presence_value(elem.find('.roster-contact'));
    RoboSDK.write_to_log('insert contact called ' + jid + '  ' + pres);
    var contacts = $('#roster-area li');
    console.log('contact length ' + contacts.length);
    // If Ul contain contacts
    if (contacts.length > 0) {
        var inserted = false;
        // Sort the insert the new contact 
        contacts.each(function() {
            var cmp_pres = RoboSDK.presence_value(
                    $(this).find('.roster-contact'));
            var cmp_jid = $(this).find('.roster-jid').text();
            console.log('pres  ' + pres + 'cmp_pres ' + cmp_pres);
            console.log('  jid  ' + jid + 'cmp_jid ' + cmp_jid);
            if (pres > cmp_pres) {
                console.log(' Reapeat pres  ' + pres + 'cmp_pres ' + cmp_pres);
                $(this).before(elem);
                inserted = true;
                return false;
            }
        });
        if (!inserted) {
            RoboSDK.write_to_log('inside insert contact  !inserted called');
            $('#roster-area ul').append(elem);
        }
    }
    // No new contatc , insert the contact directly.
    else {
        RoboSDK.write_to_log('inside insert contact  inserted called');
        $('#roster-area ul').append(elem);
    }
}
/* 
 function                : sort_helper()
 parameters              : html component li.
 parameter description   : 
 function description    : Used to return the priority
 : online has high priority than away. If status is any other then return 0 as default.
 
 */
function sort_helper(elem) {
    if (elem.hasClass('online')) {
        return 2;
    } else if (elem.hasClass('away')) {
        return 1;
    }

    return 0;
}
/* 
 function                : on_roster_Get_Contact()
 parameters              : JSON obejct
 parameter description   : JSON object contain information regarding to each contact.
 function description    : This function used to populate roster-area with contact.
 : This functin will be called when new contact becomes availale.
 
 
 */
function on_roster_Get_Contact(JsonResponse) {
    var con;
    console.log(' on_roster_Get_Contact(JsonResponse)' + JSON.stringify(JsonResponse))
    //  alert(JSON.stringify(JsonResponse));
    for (con in JsonResponse)
    {

        var jid = JsonResponse[con]['plustxtid'];
        var name = JsonResponse[con]['name'];
        var username = JsonResponse[con]['username'];
        RoboSDK.write_to_log('on_roster items ' + jid + ' ' + name);
        // transform jid into an id
        var jid_id = RoboSDK.jid_to_id(jid);
        // Prepare nameList DS for name and jid_id mapping 
        RoboSDK.nameList[jid_id] = name;
        var contact = $("<li id='" + jid_id + "'>" +
                "<div class='roster-contact offline'>" +
                "<div class='tigo-id hiddenClass'>" +
                Strophe.getNodeFromJid(jid) +
                "</div><div class='roster-name'>" +
                name +
                "</div><div class='roster-jid hiddenClass2'>" +
                jid +
                "</div><div class='username'>" +
                username +
                "</div></div></li>");
        RoboSDK.insert_contact(contact);
    }
}

/* 
 function                : getTime()
 parameters     output   : time in hour/min date/month/year formate 
 parameter description   : 
 function description    : This function create timstamp in hour/min date/month/year formate 
 
 
 
 */
function getTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
/* 
 function                : getTimeInLongString()
 parameters    output    : time in millisecond
 parameter description   : 
 function description    : This function used to return time in milli seconds
 
 
 
 */
function getTimeInLongString()
{
    return new Date().getTime();
}


/*
 *Function      : hideHomePageDiv()
 *Brief             : Used to hide the home page
 *Detail        : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function hideHomePageDiv()
{

    $('#homepagediv').addClass('hidden');
}
/*
 *Function      : ShowHomePageDiv()
 *Brief             : Used to create and Display the homePage
 *Detail        : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function ShowHomePageDiv()
{
    var homePageDiv = $("<div id='homepagediv' style='height: 100%;width: 100%;text-align: center;'></div>");
    $('#content').append(homePageDiv);
    //$('#homepagediv').removeClass('hideDiv');
}

/*
 *Function      : prepareUIForNewConatct()
 *Brief             : Used to prepare UI to remove existing content
 *Detail        : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function prepareUIForNewConatct()
{
    RoboSDK.connection = null;
    $('#roster-area ul').empty();
    $('#chatListDiv').empty();
    $('#content').empty();
    RoboSDK.openedChatDiv = {};
    RoboSDK.contact_subsription = {};
    RoboSDK.nameList = {};

}


/*
 *Function      : showProgress()
 *Brief             : Used to display progress bar during login
 *Detail        : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function showProgress()
{
   // document.getElementById('imgLoading').style.display = "";
}
/*
 *Function      : disableProgress()
 *Brief             : Used to disable progress bar on completion of roaster loading
 *Detail            : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function disableProgress()
{
   // document.getElementById('imgLoading').style.display = "none";
}
/*
 *Function      : showProgress()
 *Brief             : Used to display progress bar during login
 *Detail        : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function showMessage()
{
    //document.getElementById('reloadMessageDiv').style.display = "";
}
/*
 *Function      : disableProgress()
 *Brief             : Used to disable progress bar on completion of roaster loading
 *Detail            : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function hideMessage()
{
    //document.getElementById('reloadMessageDiv').style.display = "none";
}
/*
 *Function      : enableOrDisableTabLink()
 *Brief             : Used to to enable or disable tab links based on tego_id and sessionid
 *Detail        : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function enableOrDisableTabLink()
{
    if (LocalCache.tigoid != null && LocalCache.sessionid != null)
    {
        document.getElementById('new-contact').style.display = "";
        //document.getElementById('divider2').style.display = "";
        document.getElementById('divider3').style.display = "";
        document.getElementById('disconnect').style.display = "";
        
        document.getElementById('connect').style.display = "none";
        document.getElementById('login').style.display = "none";
        document.getElementById('sign_up').style.display = "none"; 
        document.getElementById('divider5').style.display = "none";
        document.getElementById('divider6').style.display = "none";
}
    else
    {
        document.getElementById('new-contact').style.display = "none";
       // document.getElementById('divider2').style.display = "none";
        document.getElementById('divider3').style.display = "none";
        document.getElementById('disconnect').style.display = "none";
        
        document.getElementById('connect').style.display = "";
        document.getElementById('login').style.display = "";
        document.getElementById('sign_up').style.display = ""; 
        document.getElementById('divider5').style.display = "";
        document.getElementById('divider6').style.display = "";
    }
}
/*
 *Function      : mylogin()
 *Brief             : Used to make login process aynschrouns 
 *Detail        : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function mylogin(){
    showProgress();
    setTimeout(function () { 
          $(document).trigger('startLoginProcess');
    },1000);
}
/*
 *Function      : mylogin()
 *Brief             : Used to make login process aynschrouns 
 *Detail        : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function myConnect(){
    setTimeout(function () { 
          $(document).trigger('startConnectProcess');
    },1000);
}
/*
 * 'startLoginProcess' event binded with document.Objective of making login process aynschrouns 
 */
$(document).bind('startLoginProcess',function(event){
                
                
                console.log('made aynchronus');
                prepareUIForNewConatct();
                document.getElementById('loggedUser').innerHTML = $('#jid').val();
                /*
                 * authenticate function is used to validate user name i.e. email id and password with
                 * API's server, which will inturn authenticate with XMPP server using tegoid and password
                 */

                
                authenticate($('#jid').val(), $('#password').val());
                /*
                 * showProgress: Method is used to display progress bar when login button is clicked. Progress bar will be displayed 
                 * until all contacts in roaster is listed
                 */

                $('#password').val('');
                ProgresBar.disableProgressValue="none";              
               
                
});
/*
 * 'startConnectProcess' event binded with document.Objective of making login process aynschrouns 
 */
$(document).bind('startConnectProcess',function(event){
                
                
                console.log('made aynchronus');
                prepareUIForNewConatct();
                document.getElementById('loggedUser').innerHTML = $('#emailCon').val();
                /*
                 * connectAPI function is used to validate user name i.e.
                 */

                
                connectAPI($('#fnameCon').val(), $('#lnameCon').val(),$('#emailCon').val(),$('#phoneCon').val(),$('#CcodeCon').val(),1);
                /*
                 * showProgress: Method is used to display progress bar when login button is clicked. Progress bar will be displayed 
                 * until all contacts in roaster is listed
                 */

               $('#fname').val('');
               $('#lname').val('');
               $('#email').val('');
               $('#phone').val('');
               $('#Ccode').val('');
               $('#pass1').val('');
               $('#pass2').val('');
                              
               
                
});
/*
 *Function      : myAddContact()
 *Brief             : Used to make addContact process aynschrouns 
 *Detail        : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function myAddContact(){
    setTimeout(function () { 
          $(document).trigger('initiateAddContact');
    },1000);
}
/*
 * 'initiateAddContact' event binded with document.Objective of making addContact process aynschrouns 
 */
// $(document).bind('initiateAddContact',function(event){
                
                
//                 if (LocalCache.xmpporapi == 1)
//                 {

//                     // Asking API server for corresponding tego_id 
//                    // $(this).dialog('close');                    
//                     var Result = addContacts($('#contact-jid').val());
//                     var tego_id = Result.data['tego_id'];
//                     // Email entered is not regsierted with APi Server 
//                     if (tego_id == "" || tego_id == null || tego_id == undefined) {
//                         //updateActivityStatus("Entered Email Is Not Registered");
                        
//                     }
//                     else
//                     {
//                         // API server retured the tego_id and initiating contact add operation.
//                         var jid = Result.data['tego_id'] + "@cs.plustxt.com";
//                         console.log('jid of new user ' + jid + 'tigo id of new user  ' + Result.data['tego_id']);
//                         var jid_id = RoboSDK.jid_to_id(jid);
//                         RoboSDK.nameList[jid_id] = decode64(Result.data['name']);
//                         $(document).trigger('contact_added', {
//                             jid: Result.data['tego_id'] + "@cs.plustxt.com",
//                             name: decode64(Result.data['name'])
//                         });
//                     }
//                     disableProgress();
//                 }
//                 else
//                 {
//                     // directly adding the contact with ejabbered server .
//                     // Note that entered email should be valid ejabbered ID 
//                     $(document).trigger('contact_added', {
//                         jid: $('#contact-jid').val(),
//                         name: $('#contact-name').val()
//                     });
//                 }
//                 $('#contact-jid').val('');
//                 $('#contact-name').val('');
                              
               
                
// });
/*
 *Function      : mySignUpLogin()
 *Brief             : Used to make login process aynschrouns 
 *Detail        : 
 *Input param       : -
 *Output param      : -
 *Return            : -
 */
function mySignUpLogin(){
    setTimeout(function () { 
          $(document).trigger('startSignUpLoginProcess');
    },1000);
}
/*
 * 'startLoginProcess' event binded with document.Objective of making login process aynschrouns 
 */
$(document).bind('startSignUpLoginProcess',function(event){
                
                
                console.log('made aynchronus');
                prepareUIForNewConatct();
                document.getElementById('loggedUser').innerHTML = $('#email').val();
                /*
                 * authenticate function is used to validate user name i.e. email id and password with
                 * API's server, which will inturn authenticate with XMPP server using tegoid and password
                 */

                
                authenticate($('#email').val(), $('#pass1').val(), $('#Ccode').val(), $('#fname').val(), $('#lname').val());
                    $('#fname').val('');
                    $('#lname').val('');
                    $('#pass1').val('');
                    $('#pass2').val('');
                    $('#email').val('');
                    $('#Ccode').val('');
                    $('#phone').val('');
                /*
                 * showProgress: Method is used to display progress bar when login button is clicked. Progress bar will be displayed 
                 * until all contacts in roaster is listed
                 */

                
                
               
                
});

// function reLoginOrNormalFunction(){
//           RoboSDK.reLoad = $.jStorage.get("reLoadObject", null);
//           console.log('reLoginOrNormalFunction functiion called');
//        if (RoboSDK.reLoad === null)
//             {
//                console.log('reLoad Object is null ');
//                //$('#login_dialog').dialog('open');
//                console.log('reLoad Object is null ');
//             }
//         else {
//              showProgress();
//             console.log('reLoad Object is not  null ');
//             LocalCache.sessionid = RoboSDK.reLoad['sessionID'];
//             LocalCache.password = RoboSDK.reLoad['passwordID'];
//             LocalCache.loginusername = RoboSDK.reLoad['loginusername'];
//             LocalCache.plustxtid = RoboSDK.reLoad['plustxtID'];
//             LocalCache.tigoid = RoboSDK.reLoad['tigoID'];
//             updateLoginName(RoboSDK.reLoad['loginusername']);
//             console.log(LocalCache.sessionid+'--'+LocalCache.password+'--'+LocalCache.loginusername+'--'+ LocalCache.plustxtid+'--'+LocalCache.tigoid);
//             myConnectXMPP();
//             console.log('working here also');
//         }
// }
/*
 function    : updateLoginStatus()
 parameters  : inmsg
 description : Used to update login  and connection status. 
 */

// function updateLoginStatus(inmsg)
// {
//     document.getElementById('loginStatus').innerHTML = inmsg;
// }
/*
 function    : updateLoginName()
 parameters  : inmsg
 description : Used to update login name to header section.
 : During authentication entered used name is captured and displayed at the header section
 */
// function updateLoginName(inmsg)
// {
//     document.getElementById('loggedUser').innerHTML = inmsg;
// }
/*
 function    : updateActivityStatus()
 parameters  : inmsg
 description : used to update activity status
 */
function updateActivityStatus(inmsg)
{
    document.getElementById('activityStatus').innerHTML = inmsg;
}
$(document).ready(function() {
    $.ajaxSetup({cache: false});
    ShowHomePageDiv();
     
});
/*
 * document that bind with connect event.When this event is triggered then
 * function will try connect with xmpp server and then procceds to authenticate 
 * user's username and passwords.
 * Whenever any change in the connection status happend it will trigger correspind event and do the
 * rest.
 */
 