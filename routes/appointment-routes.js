express = require("express");
const { addAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment } = require("../controllers/appointmentController");

const router = express.Router();

router.post("/createCita", addAppointment);
router.get("/getCitas", getAppointments);
router.get("/getCita", getAppointment);
router.put("/updateCita", updateAppointment);
router.delete("/deleteCita", deleteAppointment);

module.exports = {
    routes: router
}