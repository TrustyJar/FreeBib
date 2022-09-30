var CryptoJS = require("crypto-js");
const fs = require("fs");
var colors = require('colors');
var prompt = require('prompt-sync')();
const { AutoComplete } = require('enquirer');
//Defining Imports


/*
Starting the encryption CLI, you can encrypt using this cli 
and save to the data file.
*/
console.log(
`
█▀▀ █ ▀█▀ ▄▀█ ▀█▀ █ █▀█ █▄░█   █▀▀ █░░ █
█▄▄ █ ░█░ █▀█ ░█░ █ █▄█ █░▀█   █▄▄ █▄▄ █
`.white.bold
)

/*
This function will allow you to encrypt data by selecting 
the prompts and instructing how you would like your items to be
encrypted.
*/
async function cliPrompts() {

    let selectionPrompt = ""

    /*
    This is the prompt that will ask you what you would like to do. They
    can either encrypt a single line or encrypt a file.
    */
    const encryptType = new AutoComplete({
        name: 'type',
        message: 'Select What Type Of Encryption'.white.bold,
        limit: 10,
        initial: 1,
        choices: [
        '256 Bit Line'.green.bold,
        '256 Bit Full File'.green.bold,
        ]
    });
    
    // Running the prompt
    await encryptType.run()
        .then(
            //Defining the answer as a new variable and removing color coding
            answer => selectionPrompt = answer.strip
        )
        .catch(
            //Catching an error to determine if the prompt was correct
            console.log("Error Running CLI")
        );

    // End of Prompt
    
    //Prompt for encryption key
    const encryptionKey = prompt("Please Enter an Encryption Key: ".white.bold);

    //Running the read file function
    await readFile(selectionPrompt, encryptionKey);

}

/*
This function will allow you to encrypt data by passing over
the file data as a parameter and then encrypting that specific
data.
*/
async function readFile(selectionPrompt, encryptionKey) {

    if(selectionPrompt == "256 Bit Line") {
        //Reading file
        const fileData = fs
            .readFileSync('data.txt', 'utf8')
            .split('\n')
        
        //For loop to run through each line 
        for(let i = 0; i < fileData.length; i++) {
            //Encrypting the data
            var ciphertext = CryptoJS.AES.encrypt(fileData[i], encryptionKey).toString();
            //Appending File
            fs.appendFileSync('dataOutput.txt', ciphertext + "\n");
        }
    } else {
        //Reading file, no need to split as user selected to encrypt one file
        const fileData = fs.readFileSync('data.txt', 'utf8');
        //Encrypt cipher
        var ciphertext = CryptoJS.AES.encrypt(fileData, encryptionKey).toString();
        //Appending File
        fs.appendFileSync('dataOutput.txt', ciphertext + "\n");
    }

}

cliPrompts();