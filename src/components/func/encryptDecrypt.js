import CryptoJS from "crypto-js";

const encrypt = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.REACT_APP_SECRET_KEY).toString();
}

const decrypt = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.REACT_APP_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt };