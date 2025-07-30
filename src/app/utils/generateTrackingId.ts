import CryptoJS from "crypto-js";

export const generateTrackingId = (): string => {
    const prefix = "TRK";

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}${month}${day}`;

    const seed = now.getTime().toString() + Math.random().toString();
    const hash = CryptoJS.SHA256(seed).toString();

    const randomPart = hash.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();

    return `${prefix}-${dateStr}-${randomPart}`;
}
