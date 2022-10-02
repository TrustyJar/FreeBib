/*
This function is basically the 
source code for base 64 encoding. It will
encode every string to prioritize security 
on the post request.
*/
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

/*
This function will use cipher to allow the program to jamble words. 
This is the basic Caesar cipher 
algorithm. It will have a certain 
shift and bring all letters to capital.
*/
async function cipherString(str) { // LBH QVQ VG!
    //Creating array
    var arr = [];
  
    //Looping through the string
    for (var i = 0; i < str.length; i++) {
      //Defining Shift
      if (str.charCodeAt(i) < 65 || str.charCodeAt(i) > 90) {
        arr.push(str.charAt(i));
      } else if (str.charCodeAt(i) > 77) {
        //Switching letters
        arr.push(String.fromCharCode(str.charCodeAt(i) - 13));
      } else {
        arr.push(String.fromCharCode(str.charCodeAt(i) + 13));
      }
    }   
  
    //Returning encrypted value to main func
    return arr.join("");
}


/*
This function is very simple. It will first encrypt the data
with the cipher, and then it will encrypt
again using base 64 to prepare it to be sent to the server.
*/
async function encodeString(str) {
    //Encoding String
    let encryptedString = str.toUpperCase();
    //Cipher
    encryptedString = await cipherString(encryptedString);
    //Base64
    encryptedString = await Base64.encode(encryptedString);
    //Returning Encrypted String
    return encryptedString;
}

/*
This function will set a cookie inside of the web browser. It will
allow you to create a cookie and run it in the background.
*/
async function setCookie(cname, cvalue, exdays) {
    //Getting Date
    var d = new Date();
    //Setting Expiration Date
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    //Setting Expiration Date
    var expires = "expires=" + d.toUTCString();
    //Setting Cookie
    document.cookie += cname + "=" + cvalue + ";" + expires + ";path=/";
}


/*
This is one of the main functions. It will
take data from the HTML file and then
post it to the server. It is also 
responsible for encrypting all of the data 
before the request is sent.
*/
async function submitForm() {

    //Getting Data
    let url = document.getElementById('citationURL').value;
    let citationType = document.getElementById('box2').value;
    const securityToken = document.getElementById('securityToken').value;

    if(url.includes("https://") || url.includes("http://")) {

        //Encrypt the data
        url = await encodeString(url)
        citationType = await encodeString(citationType)

        //Check if invalid
        if(citationType != "invalid") {

            document.getElementById('lds-ring').style.display = "inline-block";
            document.getElementById('ringText').style.display = "inline-block";

            let responseInfo = "";

            try {
                const response = await fetch('/postCitation', {
                    method: 'POST',
                    body: JSON.stringify({
                        //Payload
                        "url": url,
                        "type": citationType,
                        "securityToken": securityToken
                    }),
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                responseInfo = await response.json();

            } catch (e) {
                responseInfo = null;
            }

            if(responseInfo != null) {
                document.getElementById("citationClass").style.display = "none";
                document.getElementById("citationClass2").style.display = "none";

                document.getElementById('lds-ring').style.display = "none";
                document.getElementById('ringText').style.display = "none";
                document.getElementById('ringText2').style.display = 'inline-block';
                
                setTimeout(function() {
                    document.getElementById('ringText2').style.display = "none"
                }, 1000);

                let parseURLData = document.cookie.split(" ");
                parseURLData = parseURLData[1].substring(8)
                parseURLData = decodeURIComponent(parseURLData);
                parseURLData = parseURLData.split(':');
                
                if(parseURLData.length == 2) {
                    document.getElementById(`citation1`).style.display = "flex";
                    document.getElementById(`citationtext1`).innerHTML = JSON.stringify(responseInfo.data)
                } else if(parseURLData.length == 3) {
                    document.getElementById(`citation2`).style.display = "flex";
                    document.getElementById(`citationtext2`).innerHTML = JSON.stringify(responseInfo.data)
                } else if(parseURLData.length == 4) {
                    document.getElementById(`citation3`).style.display = "flex";
                    document.getElementById(`citationtext3`).innerHTML = JSON.stringify(responseInfo.data)
                } else {

                    if(parseURLData.length % 4 == 1) {
                        document.getElementById(`citation2`).style.display = "none";
                        document.getElementById(`citation3`).style.display = "none";
                        document.getElementById(`citation1`).style.display = "flex";
                        document.getElementById(`citationtext1`).innerHTML = JSON.stringify(responseInfo.data)
                    } else if(parseURLData.length % 4 == 2) {
                        document.getElementById(`citation3`).style.display = "none";
                        document.getElementById(`citation2`).style.display = "flex";
                        document.getElementById(`citationtext2`).innerHTML = JSON.stringify(responseInfo.data)
                    } else {
                        document.getElementById(`citation3`).style.display = "flex";
                        document.getElementById(`citationtext3`).innerHTML = JSON.stringify(responseInfo.data) 
                    }
                }

            } else {
                document.getElementById('lds-ring').style.display = "none";
                document.getElementById('ringText').style.display = "none";

                document.getElementById('ringText3').style.display = 'inline-block';
                
                setTimeout(function() {
                    document.getElementById('ringText3').style.display = "none"
                }, 1000);
            }
            
        } else {
            //If Invalid Payload
            alert("Please select a citation type.");
        }
    } else {
        //Invalid url
        alert("Please enter a valid URL.");
    }
    
}
