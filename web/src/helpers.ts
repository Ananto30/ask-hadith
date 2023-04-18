import type { HadithModel } from "./models";
import { encode } from "url-safe-base64"

export const ToUrlsafeBase64 = (hadith: HadithModel) => {
    if (!hadith) return '';
    // const buf = Buffer.from(JSON.stringify(hadith));
    // return encodeURIComponent(buf.toString('base64'));
    return encode(JSON.stringify(hadith));
};