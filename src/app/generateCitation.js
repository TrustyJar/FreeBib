const axios = require('axios-https-proxy-fix');
var CryptoJS = require("crypto-js");
const fs = require('fs');
//Defining Imports


/*
This is the citation function. This function will be ran by 
the server once the post request is fulfilled. 
Then it will respond data for the main function to parse.
*/
async function generateCitation(citationURL) {

    //Random Function for proxies
    function random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    //Defining proxy list
    const list = fs
        .readFileSync('./Data/proxies.txt', "utf8")
        .split("\n")
        .filter(String)
    let raw = random(list);

    //Decrypting encrypted proxies
    var bytes  = CryptoJS.AES.decrypt(raw, 'jsdhfjdsgfiagdsofyowefbvsbjbfiinhfigia');
    raw = bytes.toString(CryptoJS.enc.Utf8);

    //Splitting proxy
    const splitproxy = raw.split(':');

    //Initializing the return data variable as an empty string.
    let returnData = "";

    try {
        const response = await axios({
            //Defining request method
            method: 'GET',
            //Adding request url. The URL of the article is a parameter.
            url: `https://autocite.citation-api.com/api/v3/query?url=${citationURL}`,
            //Adding request headers.
            headers: {
                "Host": "autocite.citation-api.com",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0",
                "Accept": "application/vnd.com.easybib.data+json",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Referer": "https://www.citationmachine.net/",
                "Pragma": "no-cache",
                "X-Alcell": "oneplusx-6-control",
                "Origin": "https://www.citationmachine.net",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "Dnt": "1",
            },
            //Proxying the request so IP is varying.
            proxy: {
                host: splitproxy[0],
                port: splitproxy[1],
                auth: {
                    username: splitproxy[2],
                    password: splitproxy[3].replace('\r', '')
                }
            },
            timeout: 10000
        })

        /*
        Checking for a response. If there is a response
        it will check if the data is correct.
        If the data is correct then it will set the data
        as the return value.
        */
        if(response.data.results) {
            //Setting data as return value
            returnData = response.data;
        } else {
            //Invalid as data is wrong
            returnData = "Invalid Response";
        }
    } catch (e) {
        //Invalid as there was an error
        returnData = "Error HTTP";
    }

    //Returning either data or error
    return returnData;

}

//Exporting function so it can be called inside html and server.
module.exports = {generateCitation}
