const express = require("express");
const { addDoctor, getDoctor, updateDoctor, deleteDoctor } = require("../controllers/doctorController");

const router = express.Router();

router.post("/signUp", addDoctor);
router.get("/signIn", getDoctor);
router.put("/patient/:id", updateDoctor);
router.delete("/patient/:id", deleteDoctor);

module.exports = {
  routes: router,
};
