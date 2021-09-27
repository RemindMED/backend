"use strict";

const dotenv = require("dotenv");
const assert = require("assert");

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER
} = process.env;


// assert(PORT, "PORT is required");
// assert(HOST, "HOST is required");

module.exports = {
  port: PORT,
  host: HOST,
  url: HOST_URL,
  twilio_accout_sid: TWILIO_ACCOUNT_SID,
  twilio_auth_token: TWILIO_AUTH_TOKEN,
  twilio_phone_number: TWILIO_PHONE_NUMBER
};
