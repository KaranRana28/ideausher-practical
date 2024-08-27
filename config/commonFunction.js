const cryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const encryption = (data) => {
    let ciphertext = process.env.ENV === 'Local' ? data : cryptoJS.AES.encrypt(JSON.stringify(data), process.env.CRYPTO_SECRET_KEY).toString();
    return ciphertext;
}

const decryption = (data) => {
    let decryptedData = null;
    if (process.env.ENV === 'Local') {
        decryptedData = data //JSON.parse(data)
    } else {
        let bytes = cryptoJS.AES.decrypt(data, process.env.CRYPTO_SECRET_KEY);
        decryptedData = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
    }
    return decryptedData;
};

const generateToken = async (user, secret, expire = '84d') => {
    return jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }, secret, { expiresIn: expire });
};

const decrypt = async (password, encryotedPassword) => {
    let decryptPassword = await bcrypt.compare(password, encryotedPassword);
    return decryptPassword;
};

const encryptionData = (data, key = process.env.CRYPTO_SECRET_KEY) => {
    let ciphertext = cryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return ciphertext;
}

const parseJSON = (data) => {
    if (typeof data == "object") {
        return data;
    }
    try {
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

module.exports = {
    decryption: decryption,
    generateToken: generateToken,
    encryptionData: encryptionData,
    decrypt: decrypt,
    parseJSON: parseJSON,
    encryption: encryption
}