const express = require('express')
const path = require('path');
const app = express();
let port = process.env.PORT || 3000;
let ejs = require('ejs')
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require('uuid');
const { generateCitation } = require('../app/generateCitation')
const {encryptData} = require('../../Security/encryptData.js');
const errorLog = require('../../Data/Responses/404.json')
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
    app.use(express.static(__dirname + '/public'));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: false
    }));
    app.use(cookieParser())


    /*
    Calling the main homepage. All of the functionality will 
    appear here. This includes setting cookies, 
    running the page, calling other functions, ETC.  
    */
    app.get('/', function (req, res, next) {

        async function generateData() {
            //Placeholder value
            const setData = await generateCitation('https://www.wesh.com/article/ian-tropical-storm-flooding/41437849')
            console.log(setData)
            res.status(200).sendFile(path.join(__dirname, './public/index.html'));
        }

        generateData();
    });
    
    /*
    This method will be used to redirect users whenever they visit an invalid page, rather
    than giving them the ugly express error.
    */
    app.use(function(req, res, next){
        //Sending 404 Message
        res.status(403).sendFile(path.join(__dirname, './public/404.html'));
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