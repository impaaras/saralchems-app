const localUrl = 'http://172.20.10.3:4000'
const prodUrl = `https://api.saraldyechems.com`;

let isProduction = true;

export const API_URL = isProduction ? prodUrl : localUrl;