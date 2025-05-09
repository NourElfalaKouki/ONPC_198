/**
 * Generate cryptographically strong random values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Crypto
 * @param byteLength
 */
function getRandomBytes(byteLength: number) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return bytes;
}

/**
 * Convert a byte array to a base64 string
 * @param bytes
 */
function toBase64(bytes: Uint8Array) {
    const str = String.fromCharCode(...bytes);
    return btoa(str);
}

/**
 * Generate a cryptographically secure random string
 * @param byteLength
 */
export default function uid(byteLength: number = 12) {
    const bytes = getRandomBytes(byteLength);
    const base64 = toBase64(bytes);
    return base64.replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
