const express = require("express");
const { addPatient, getPatients, getPatient, updatePatient, deletePatient } = require("../controllers/patientController");

const router = express.Router();

router.post("/createPaciente", addPatient);
router.get("/getPacientes", getPatients);
router.get("/getPaciente", getPatient);
router.put("/updatePaciente", updatePatient);
router.delete("/deletePaciente", deletePatient);

module.exports = {
  routes: router,
};
