"use strict";

const express = require("express");
const cors = require("cors");
const config = require("./config");
const patientRoutes = require("./routes/patient-routes");
const doctorRoutes = require("./routes/doctor-routes");
const appointmentRoutes = require("./routes/appointment-routes");
const fileUpload = require("express-fileupload");
const cron = require("node-cron");

const sendSMSAlerts = require("./functions/sendSMSAlerts");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

cron.schedule("* * * * *", function () {
	console.log("rSending alerts");
    sendSMSAlerts(60);
});


app.use(
	"/api",
	patientRoutes.routes,
	doctorRoutes.routes,
	appointmentRoutes.routes
);

app.listen(process.env.PORT || config.port || 3000, () =>
	console.log("App is listening on url http://localhost:" + config.port)
);
