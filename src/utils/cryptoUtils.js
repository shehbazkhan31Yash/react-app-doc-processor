import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "";


export const encryptData = (data, key = SECRET_KEY) => {
  const jsonString = typeof data === "string" ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, key).toString();
};


export const decryptData = (ciphertext, key = SECRET_KEY) => {
  if (!ciphertext || !key) {
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(String(ciphertext), key);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) return null;

    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch {
    return null;
  }
};
