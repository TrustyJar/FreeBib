var CryptoJS = require("crypto-js");

async function encryptData(type, data) {

    let returnRes = "";

    try {
        const key = "jsdhfjdsgfiagdsofyowefbvsbjbfiinhfigia";
        //Defining secret key
        if (type == "encryption") {
            var result = CryptoJS.AES.encrypt(data, key).toString();
            //Encrypting Data
            returnRes = result;
        } else if (type == "decryption") {
            var bytes = CryptoJS.AES.decrypt(data, key);
            //Decrypting data
            var result = bytes.toString(CryptoJS.enc.Utf8);
            //Converting byte to string
            returnRes = result;
        }
    } catch (e) {
        returnRes = "null"; 
    }

    return returnRes;

}

module.exports = {encryptData}