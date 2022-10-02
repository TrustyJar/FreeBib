//Initializing function
function init() {
    //Waiting for change
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}
  
//Handling file
function handleFileSelect(event) {
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
}
  
//Logging Final File
async function handleFileLoad(event) {
    //Defining file output

    let parseURLData = event.target.result;

    await setCookie("bibSess", parseURLData, 365)

    let parseURLDataCookie = document.cookie.split(";");
    parseURLDataCookie = parseURLData[0].substring(8)
    parseURLDataCookie = decodeURIComponent(parseURLData);
    parseURLDataCookie = parseURLData.split(':');

    document.getElementById("citationClass").style.display = "none";
    document.getElementById("citationClass2").style.display = "none";

    if(parseURLDataCookie.length == 2) {
        document.getElementById(`citation1`).style.display = "flex";
        document.getElementById(`citationtext1`).innerHTML = parseURLDataCookie[0]
    } else if(parseURLDataCookie.length == 3) {
        document.getElementById(`citation1`).style.display = "flex";
        document.getElementById(`citationtext1`).innerHTML = parseURLDataCookie[0]
        document.getElementById(`citation2`).style.display = "flex";
        document.getElementById(`citationtext2`).innerHTML = parseURLDataCookie[1]
    } else if(parseURLDataCookie.length == 4) {
        document.getElementById(`citation1`).style.display = "flex";
        document.getElementById(`citationtext1`).innerHTML = parseURLDataCookie[0]
        document.getElementById(`citation2`).style.display = "flex";
        document.getElementById(`citationtext2`).innerHTML = parseURLDataCookie[1]
        document.getElementById(`citation3`).style.display = "flex";
        document.getElementById(`citationtext3`).innerHTML = parseURLDataCookie[2]
    } else {

        if(parseURLDataCookie.length % 4 == 1) {
            document.getElementById(`citation2`).style.display = "none";
            document.getElementById(`citation3`).style.display = "none";
            document.getElementById(`citation1`).style.display = "flex";
            document.getElementById(`citationtext1`).innerHTML = parseURLDataCookie[0]
        } else if(parseURLDataCookie.length % 4 == 2) {
            document.getElementById(`citation3`).style.display = "none";
            document.getElementById(`citation1`).style.display = "flex";
            document.getElementById(`citationtext1`).innerHTML = parseURLDataCookie[0]
            document.getElementById(`citation2`).style.display = "flex";
            document.getElementById(`citationtext2`).innerHTML = parseURLDataCookie[1]
        } else {
            document.getElementById(`citation1`).style.display = "flex";
            document.getElementById(`citationtext1`).innerHTML = parseURLDataCookie[0]
            document.getElementById(`citation2`).style.display = "flex";
            document.getElementById(`citationtext2`).innerHTML = parseURLDataCookie[1]
            document.getElementById(`citation3`).style.display = "flex";
            document.getElementById(`citationtext3`).innerHTML = parseURLDataCookie[2]
        }
    }

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
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}