const admin = require("firebase-admin");
const serviceAccount = require("./key_service_account.json");

const db = admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

module.exports = db;