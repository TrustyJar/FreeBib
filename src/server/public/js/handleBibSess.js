/*
This function is responsible for handling the bibSess cookie. This
cookie helps store peoples citations for the next time that they
visit the site.
*/
function handleBibSess() {
    let parseURLData = document.cookie.split(";");
    parseURLData = parseURLData[0].substring(8)
    parseURLData = decodeURIComponent(parseURLData);
    parseURLData = parseURLData.split(':');

    if(parseURLData.length == 2) {
        document.getElementById(`citation1`).style.display = "flex";
        document.getElementById(`citationtext1`).innerHTML = JSON.stringify(parseURLData[0])
    } else if(parseURLData.length == 3) {
        document.getElementById(`citation1`).style.display = "flex";
        document.getElementById(`citationtext1`).innerHTML = JSON.stringify(parseURLData[0])
        document.getElementById(`citation2`).style.display = "flex";
        document.getElementById(`citationtext2`).innerHTML = JSON.stringify(parseURLData[1])
    } else if(parseURLData.length == 4) {
        document.getElementById(`citation1`).style.display = "flex";
        document.getElementById(`citationtext1`).innerHTML = JSON.stringify(parseURLData[0])
        document.getElementById(`citation2`).style.display = "flex";
        document.getElementById(`citationtext2`).innerHTML = JSON.stringify(parseURLData[1])
        document.getElementById(`citation3`).style.display = "flex";
        document.getElementById(`citationtext3`).innerHTML = JSON.stringify(parseURLData[2])
    } else {

        if(parseURLData.length % 4 == 1) {
            document.getElementById(`citation2`).style.display = "none";
            document.getElementById(`citation3`).style.display = "none";
            document.getElementById(`citation1`).style.display = "flex";
            document.getElementById(`citationtext1`).innerHTML = JSON.stringify(parseURLData[0])
        } else if(parseURLData.length % 4 == 2) {
            document.getElementById(`citation3`).style.display = "none";
            document.getElementById(`citation1`).style.display = "flex";
            document.getElementById(`citationtext1`).innerHTML = JSON.stringify(parseURLData[0])
            document.getElementById(`citation2`).style.display = "flex";
            document.getElementById(`citationtext2`).innerHTML = JSON.stringify(parseURLData[1])
        } else {
            document.getElementById(`citation1`).style.display = "flex";
            document.getElementById(`citationtext1`).innerHTML = JSON.stringify(parseURLData[0])
            document.getElementById(`citation2`).style.display = "flex";
            document.getElementById(`citationtext2`).innerHTML = JSON.stringify(parseURLData[1])
            document.getElementById(`citation3`).style.display = "flex";
            document.getElementById(`citationtext3`).innerHTML = JSON.stringify(parseURLData[2])
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
    document.cookie += cname + "=" + cvalue + ";" + expires + ";path=/";
}