
/*
 function                : validateEmailAddress()
 parameters              : element
 parameter description   : Input box object which contain email entry                          
 function  description   : Function to validate the email ID entered. 
 */
function validateEmailAddress(element)
{
    var regEx = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    var value = element.val();
    if (!regEx.test(value) && value != "")
    {
        return false;
    }
    else
    {
        return true;
    }
}
/*
 function                : ValidationPhone()
 parameters              : element
 parameter description   : Input box object which contain phone entry                          
 function  description   : Function to validate the phone number entered. 
 */
function ValidationPhone(element)
{
    var phone = element.val();
    if (phone == "" || isNaN(phone) || ((phone.length < 1) || (phone.length > 10)))
    {
        return false;
    }
    return true;
}
/*
 function                : Validationpasscode()
 parameters              : pass1,pass2
 parameter description   : pass1 contain text value of passcode 1 input text box
 pass2 contain text value of passcode 2 input text box 
 function  description   : Function to validate password 
 */
function Validationpasscode(pass1, pass2)
{

    if (pass1 !== pass2) {
        return false;
    }
    if (pass1 == "") {
        return false;
    }
    if (pass1 == null) {
        return false;
    }
    return true;
}
/*
 function                : setXMPPorAPIXMPP()
 parameters              : elem
 parameter description   : Checkbox object
 function  description   : Function to validate password 
 */
function setXMPPorAPIXMPP(elem) {

    if (elem.checked == true)
    {
        // alert('called xmpporapi=1;')
        LocalCache.xmpporapi = 1;
    }
    else {
        // alert('called xmpporapi=0;')
        LocalCache.xmpporapi = 0;
    }

}