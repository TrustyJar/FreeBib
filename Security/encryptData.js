var CryptoJS = require("crypto-js");

async function encryptData(type, data) {
    const key = "jsdhfjdsgfiagdsofyowefbvsbjbfiinhfigia";
    //Defining secret key
    if (type == "encryption") {
        var result = CryptoJS.AES.encrypt(data, key).toString();
        //Encrypting Data
        return result;
    } else if (type == "decryption") {
        var bytes = CryptoJS.AES.decrypt(data, key);
        //Decrypting data
        var result = bytes.toString(CryptoJS.enc.Utf8);
        //Converting byte to string
        return result;
    }

}

module.exports = {encryptData}