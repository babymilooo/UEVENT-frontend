"use client"
const { default: axios } = require("axios");

// const resp = await axios.get('https://ipapi.co/json/');

// export const userCountryCode = resp.data.country_code;

let countryCode = null;
let countryName = null;

export async function getUserCountryCode() {
  if (countryCode) return countryCode;
  try {
     const resp = await axios.get('https://ipapi.co/json/');
     countryCode = resp.data.country_code;
     countryName = resp.data.country_name;
    return resp.data.country_code;
  } catch (error) {
    return "UA";
  }
 
}

export async function getUserCountryName() {
  if (countryName) return countryName;
  try {
     const resp = await axios.get('https://ipapi.co/json/');
     countryCode = resp.data.country_code;
     countryName = resp.data.country_name;
    return resp.data.country_name;
  } catch (error) {
    return "Ukraine";
  }
 
}

