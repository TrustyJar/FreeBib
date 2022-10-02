const express = require('express')
const path = require('path');
const app = express();
let port = process.env.PORT || 3000;
let ejs = require('ejs')
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require('uuid');
const { generateCitation } = require('../app/generateCitation.js')
const {encryptData} = require('../../Security/encryptData.js');
const errorLog = require('../../Data/Responses/404.json')
const payloadError = require('../../Data/Responses/400.json')
const accessDenied = require('../../Data/Responses/403.json')
const {decodeString} = require('./public/js/browserDecrypt.js')
const {parseDataChicago}  = require('../app/parseTypes/chicago.js');
const {parseDataMLA} = require('../app/parseTypes/mla.js')
//Defining Imports an Variables


/*
This function, which will be called from the main file, will start the server
of the app, allowing users to see and communicate with the frontend. This will
be the main file of the program, calling many other seperate function files.
*/
async function runServer() {

    /*
    These few lines are very important. They allow you to
    parse url encoded and json formatted payload. Without this,
    no App.Post methods will work. 
    */
    app.use('/assets',express.static(path.join(__dirname, 'public/assets')));
    app.use('/js',express.static(path.join(__dirname, 'public/js')));
    app.use('/css',express.static(path.join(__dirname, 'public/css')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));   
    app.use(cookieParser())


    /*
    Calling the main homepage. All of the functionality will 
    appear here. This includes setting cookies, 
    running the page, calling other functions, ETC.  
    */
    app.get('/', function (req, res, next) {

        async function generateData() {
            res.status(200).sendFile(path.join(__dirname, './public/index.html'));
        }

        async function setInitSessCookie() {

            const preSess = await encryptData("encryption", req.headers['x-forwarded-for'] || req.connection.remoteAddress);

            res.cookie('preSess', preSess, {
                maxAge: 6.048e+8,
                httpOnly: false
            });


            if(req.cookies.bibSess == undefined) {
                res.cookie('bibSess', "null", {
                    maxAge: 3.156e+10,
                    httpOnly: false
                });
            } else {
                if(req.cookies.bibSess != "null") {
                    let splitCookie = decodeURIComponent(req.cookies.bibSess);
                    splitCookie = splitCookie.split(':');
                    if(splitCookie.length > 10) {
                        res.cookie('bibSess', "null", {
                            maxAge: 3.156e+10,
                            httpOnly: false
                        }); 
                    }
                }
            }
            
            generateData();
        }

        if (req.headers['x-forwarded-proto'] != 'https') {
            res.redirect('https://freebib.herokuapp.com/');
        } else {
            setInitSessCookie();
        }
    });

    /*
    This is the function that will handle the citation
    generationa and formatting. It will return the full citation
    back to the main page for the user to use. 
    */
    app.post('/postCitation', async function (req, res, next) {
        async function runPostFunc() {

            //Decoding the encrypted data
            const decryptedURL = await decodeString(req.body.url)
            const decryptedFormat = await decodeString(req.body.type);

            //Generating citation dara
            const citationData = await generateCitation(decryptedURL);

            if(citationData == "Invalid Response" || citationData == "Error HTTP") {
                res.send(payloadError)
            } else {

                //Initializing final return value variable
                //This variable will contain the final citation
                let finalizedCitation = "";

                //Conditional to check citation type.
                if(decryptedFormat == "chicago") {
                    //Parsing data in chicago
                    finalizedCitation = await parseDataChicago(JSON.stringify(citationData));
                    //Error Conditional
                    if(finalizedCitation == "Invalid URL") {
                        res.status(400).send(payloadError);
                    } else {
                        //Handling cookies
                        await handleCookies(finalizedCitation);
                        //Sending Response
                        res.send({
                            "status": 200,
                            "data": finalizedCitation
                        });
                    }
                } else if(decryptedFormat == "mla") {
                    //Parsing data in mla
                    finalizedCitation = await parseDataMLA(JSON.stringify(citationData));
                    //Error Conditional
                    if(finalizedCitation == "Invalid URL") {
                        res.status(400).send(payloadError);
                    } else {
                        //Handling cookies
                        await handleCookies(finalizedCitation);
                        //Sending Response
                        res.send({
                            "status": 200,
                            "data": finalizedCitation
                        });
                    }
                }
            }            
            
        }

        /*
        This function will handle the session cookie which contains all of the info
        for the session (citations). It is packed to base64 for convenience but really,
        there is no use for encrypting the data.
        */
        async function handleCookies(finalizedCitation) {

            //Defining new cookie value
            let newCookie = "";

            //Checking if there are alr no citations
            if(req.cookies.bibSess == "null") {
                //If so, only adding one
                newCookie = `${finalizedCitation}:`;
            } else {
                //Else stacking
                newCookie = req.cookies.bibSess + `${finalizedCitation}:`;
            }

            //Re-adding the cookie to contain the new values
            res.cookie('bibSess', newCookie, {
                maxAge: 3.156e+10,
                httpOnly: false
            });

        }

        if (req.headers['x-forwarded-proto'] != 'https') {
            res.redirect('https://freebib.herokuapp.com/postCitation');
        } else {
            //Security functions to check. Looking for all body and cookies
            if(req.body.url && req.body.type && req.body.securityToken && req.cookies.preSess) {
                //Checking if the security token condition is true
                if(req.body.securityToken % 7 == 0) {
                    //Decrypting Data
                    const preSess = await encryptData("decryption", req.cookies.preSess);
                    if(preSess == "") {
                        res.status(403).send(accessDenied);
                        //Checking if preSess = the IP
                    } else if(req.headers['x-forwarded-for'] || req.connection.remoteAddress) {
                        //If conditions all true, run main func.
                        runPostFunc();
                    } else {
                        //403
                        res.status(403).send(accessDenied);
                    }
                } else {
                    //403
                    res.status(403).send(accessDenied);
                }
            } else {
                //403
                res.status(403).send(accessDenied);
            }
        }
    });
    
    /*
    This method will be used to redirect users whenever they visit an invalid page, rather
    than giving them the ugly express error.
    */
    app.use(function(req, res, next){
        //Sending 404 Message
        if (req.headers['x-forwarded-proto'] != 'https') {
            res.redirect('https://freebib.herokuapp.com/404');
        } else {
            res.status(404).sendFile(path.join(__dirname, './public/404.html'));
        }
    });

    /*
    Setting the localhost port, this does not matter much with the
    actual app as it uses https and not http.
    */
    app.listen(port, () => {
        console.log(`Citation app listening at http://127.0.0.1:${port}`);
        //Listening to port
    });

}

//Exporting the function so it can be called via main
module.exports = {runServer};