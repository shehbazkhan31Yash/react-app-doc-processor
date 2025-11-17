import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "";

export const encryptData = (data, key = SECRET_KEY) => {
  // Accept string or object
  const jsonString = typeof data === "string" ? data : JSON.stringify(data);
  // Using passphrase-style encryption (produce base64 string)
  return CryptoJS.AES.encrypt(jsonString, key).toString();
};

export const decryptData = (ciphertext, key = SECRET_KEY) => {
  if (!ciphertext || !key) {
    return null;
  }

  try {
    // Simpler and reliable API: pass the base64 string and the passphrase
    const bytes = CryptoJS.AES.decrypt(String(ciphertext), key);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    // If empty, decryption likely failed
    if (!decryptedString) return null;

    // Try to parse JSON, otherwise return string
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch {
    // Catch any malformed UTF-8 / parsing error and return null
    // Don't rethrow — handle gracefully upstream
    // console.warn('decryptData failed', err);
    return null;
  }
};
