const localUrl = 'http://192.168.1.5:3000';
const prodUrl = `https://api.saraldyechems.com`;

let isProduction = true;

export const API_URL = isProduction ? prodUrl : localUrl;
