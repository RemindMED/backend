"use strict";

const firebase = require("../db");
const Patient = require("../models/patient");
const trimFields = require("../functions/trimFields");
const { validatePatientForm } = require("../functions/validation");
const firestore = firebase.firestore();

const addPatient = async (req, res, next) => {
	try {
		const errores = validatePatientForm(req);
		if (!req.body.doctorId) {
			res.status(400).json(
				"No se puede realizar la comunicacion con el servidor. Doctor ID faltante."
			);
			return;
		}
		if (errores) {
			res.status(400).json(errores);
			return;
		}

		const patient = await firestore.collection("Patients").add(req.body);
		res.json(patient.id);
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const getPatients = async (req, res, next) => {
	try {
		const doctorId = req.query.doctorId;

		const patients = await firestore
			.collection("Patients")
			.where("doctorId", "==", doctorId);

		const data = await patients.get();

		const patientsArray = [];

		data.forEach((doc) => {
			const patient = new Patient(
				doc.id,
				doc.data().nombre,
				doc.data().apellido,
				doc.data().sexo,
				doc.data().fechaNacimiento,
				doc.data().edad,
				doc.data().estadoCivil,
				doc.data().email,
				doc.data().celular,
				doc.data().foto
			);
			patientsArray.push(patient);
		});
		res.json(patientsArray);
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const getPatient = async (req, res, next) => {
	try {
		const id = req.query.id;
		const patient = await firestore.collection("Patients").doc(id);
		const data = await patient.get();

		if (data.exists) {
			res.status(200).json(data.data());
		} else {
			res.status(400).json("Patient with the given id not found");
		}
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const updatePatient = async (req, res, next) => {
	try {
		const id = req.query.id;

		if (!id) {
			res.status(400).json(
				"No se puede realizar la comunicacion con el servidor. Paciente ID faltante."
			);
			return;
		}

		const errores = validatePatientForm(req);

		if (errores) {
			res.status(400).json(errores);
			return;
		}

		const data = req.body;
		const patient = await firestore.collection("Patients").doc(id);
		await patient.update(data);
		res.json("Patient record updated successfully");
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const deletePatient = async (req, res, next) => {
	try {
		const pacienteId = req.query.id;
		await firestore.collection("Patients").doc(pacienteId).delete();
		var patient_appointments = firestore
			.collection("Appointments")
			.where("pacienteId", "==", pacienteId);
			
		patient_appointments.get().then(function (querySnapshot) {
			querySnapshot.forEach(function (doc) {
				doc.ref.delete();
			});
		});
		res.json("Record deleted successfully");
	} catch (error) {
		res.status(400).json(error.message);
	}
};

module.exports = {
	addPatient,
	getPatients,
	getPatient,
	updatePatient,
	deletePatient,
};
