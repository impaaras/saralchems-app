const localUrl = 'http://192.168.1.5:3000';
const prodUrl = `https://api.saraldyechems.com`;

let isProduction = false;

export const API_URL = isProduction ? prodUrl : localUrl;
