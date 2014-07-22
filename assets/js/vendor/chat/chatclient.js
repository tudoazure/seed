
var url;
var postdata = {};
var connectionURL = 'https://'+ constants.Url.chatServerURl +'/http-bind/';
window.ChatInit = function() {
    // init the CHAT JS SDK
    Plustxt.init({
        //appId         : 'YOUR_APP_ID',  // App ID through a Dashboard or generated offline    
    });
// Additional initialization code such as adding Event Listeners goes here
};


/*
 function    : isConnected()
 parameters  : NA
 description : This API supports checking if client connection with Plustxt server is there.
 : SDK method will provide relevant issue if any. 
 : Returns True if connected to PlusTxt server else returns false.
 */
function isConnected()
{

}

/*
 function    : isauthenticated()
 parameters  : NA
 description : This API supports checking if current user is already logged in or not. 
 :If user is not authenticated, it is expected for client to call Authenticate. 
 :Once Authenticated, Plustxt SDK takes care of reconnection logic. 
 */
function isauthenticated()
{

}

/*
 function    : disConnect()
 parameters  : NA
 description : SDK methods invoked disconnect which logs out user from current plustxt session. 
 : A new user can connect. This SDK method follows with trash if local Plustxt data needs to be deleted
 : Disconnect function also drops local cashed database from session scope.
 */
// function disConnect()
// {
//     LocalCache.clearCache(LocalCache.plustxtid);
// }

/*
 function    : getPlustxtId()
 parameters  : NA
 description : Gets the current Plustxt ID
 */
function getPlustxtId()
{
    return LocalCache.plustxtid;
}

/*
 function    : clearCachedDatabase()
 parameters  : NA
 description : This SDK trash complete local data and disconnects user.
 : Internally it will use Plustxt id to delete respective database.
 */
// function clearCachedDatabase(inplustxtid)
// {
//     LocalCache.clearCache(inplustxtid);
// }





/*
 function    : getAllMessages(plustxtId)
 parameters  : NA
 description : Gets all the messages (both sent and received) exchanged with the specified user.
 :  The API takes plustxt Id of the user as the input.
 */
function getAllMessages(plustxtId)
{

}

function reLoad()
{
}

/*
 function    : setDataToLocalCache()
 parameters  : contactlist
 description : Gets all the messages (both sent and received) exchanged with the all users
 : Decode the JSON response and store data locally
 : 
 */
// function setDataToLocalCache(contactlist)
// {
//     //alert('session id--'+LocalCache.sessionid);
//     url = "https://c.paytm.com/messages/get-all-conversations/";
//     postdata = {};
//     postdata["session_id"] = LocalCache.sessionid;
//     postdata = $.param(postdata);
//     var Result = coreAPI.getAPIResult(url, postdata);
//     console.log('message list available' + JSON.stringify(Result));
//     LocalCache.getAPIData_StoreLocally(Result, contactlist);
// }

/*
 function    : getConversationForAContact()
 parameters  : tigo_id_of_other_party
 description : Get All conversation between Login user and other party selected.(tigo_id_of_other_party)
 : 
 */
function getConversationForAContact(tigo_id_of_other_party)
{
    var plustxtref = "Plustx_" + LocalCache.plustxtid;
    var value = $.jStorage.get(plustxtref, null);
    console.log('plustxtref' + "Plustx_" + LocalCache.plustxtid + ' tigo_id of other party ' + tigo_id_of_other_party);

    //alert('getConversationForAContact->'+JSON.stringify(value['message'][tigo_id_of_other_party]));
    //alert('getConversationForAContact->'+JSON.stringify(value['message'][tigo_id_of_other_party]));
    console.log('getConversationForAContact->' + JSON.stringify(value['message'][tigo_id_of_other_party]));
    var ConversationWithContact = value['message'][tigo_id_of_other_party];
    //alert('Before---'+JSON.stringify(ConversationWithContact));
    //ConversationWithContact ordered by Last_ts but messages should be displayed in the order of sent_on ascending
    var sort_by = function(field, reverse, primer) {
        var key = function(x) {
            return primer ? primer(x[field]) : x[field]
        };
        return function(a, b) {
            var A = key(a), B = key(b);
            return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1, 1][+!!reverse];
        }
    }
    if (ConversationWithContact === undefined || ConversationWithContact == "" || ConversationWithContact == null) {

    }
    else {
        ConversationWithContact.sort(sort_by('sent_on', true, parseInt));
    }
    //alert('After---'+JSON.stringify(ConversationWithContact));

    return value['message'][tigo_id_of_other_party];
}

// /*
//  function    : getHistory()
//  parameters  : NA
//  description : Get history for login user
//  : 
//  */
// function getHistory()
// {
//     //  alert('getAllRosters called');
//     var plustxtref = "Plustx_" + LocalCache.plustxtid;
//     var value = $.jStorage.get(plustxtref, null);
//     // alert('getAllRosters called after fetching');
//     //  alert('getAllRosters- from chatClient ->'+JSON.stringify(value['contact']));

//     return value['history'];
// }

// /*
//  function    : sendMessage()
//  parameters  : inreceiverjid, insenderjid, inmessage
//  description : update message details to
//  : 
//  */
// function sendMessage(inreceiverjid, insenderjid, inmessage, inTime, mid)
// {
//     LocalCache.addMessage(inreceiverjid, insenderjid, inmessage, inTime, mid);
// }