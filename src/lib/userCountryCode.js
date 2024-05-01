"use client"
const { default: axios } = require("axios");

// const resp = await axios.get('https://ipapi.co/json/');

// export const userCountryCode = resp.data.country_code;

let countryCode = null;

export async function getUserCountryCode() {
  if (countryCode) return countryCode;
  try {
     const resp = await axios.get('https://ipapi.co/json/');
     countryCode = resp.data.country_code;
  return resp.data.country_code;
  } catch (error) {
    return "UA";
  }
 
}
