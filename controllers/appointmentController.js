"use strict";

const firebase = require("../db");
const Appointment = require("../models/appointment");
const firestore = firebase.firestore();
var moment = require("moment");

const addAppointment = async (req, res, next) => {
	try {
		const data = req.body;

		const doctorId = data.doctorId;

		if (!doctorId || !data.horario) {
			res.status(400).json(
				"No se puede realizar la comunicacion con el servidor. Doctor ID o horario faltante."
			);
			return;
		}

		data.horario = new Date(data.horario);

		if (await overlaps(data.horario, doctorId)) {
			res.status(400).json(
				"El horario seleccionado se encuentra ocupado."
			);
			return;
		}

		const response = await firestore.collection("Appointments").add(data);
		res.json(response.id);
	} catch (error) {
		res.status(400).json(error.message);
	}
};

function convertTZ(date, tzString) {
	return new Date(
		(typeof date === "string" ? new Date(date) : date).toLocaleString(
			"en-US",
			{ timeZone: tzString }
		)
	);
}

const overlaps = async (horario, doctorId) => {
    // if (true) {
    //     return true;
    // }

	let appointments = await _getAppointments(doctorId);

	let horario2 = moment(horario).format("YYYY-MM-DD HH:mm:ss");


	let horarioS = moment(horario);
	let horarioE = moment(horario).add(30, "minutes");


	appointments.forEach((oldAppointment) => {
		let oldDateS = moment(oldAppointment.horario);
		let oldDateE = moment(oldAppointment.horario)
			.add(30, "minutes");

		// console.log(
		// 	horarioS.format("YYYY-MM-DD HH:mm:ss"),
		// 	horarioE.format("YYYY-MM-DD HH:mm:ss"),
		// 	oldDateS.format("YYYY-MM-DD HH:mm:ss"),
		// 	oldDateE.format("YYYY-MM-DD HH:mm:ss")
		// );

		if (
			moment(oldDateS).isBetween(horarioS, horarioE) ||
			moment(oldDateE).isBetween(horarioS, horarioE) ||
			moment(horarioS).isBetween(oldDateS, oldDateE) ||
			moment(horarioE).isBetween(oldDateS, oldDateE)
		) {

			return true;
		}
	});
	return false;
};

const _getAppointments = async (id) => {
	const appointments = await firestore
		.collection("Appointments")
		.where("doctorId", "==", id);

	const data = await appointments.get();

	if (data.empty) {
		return [];
	}

	const appointmentsArray = [];

	data.forEach((doc) => {
		const appointment = new Appointment(
			doc.id,
			doc.data().nombre,
			doc.data().pacienteId,
			doc.data().doctorId,
			doc.data().motivo,
			doc.data().horario,
			doc.data().comentarios
		);
		appointmentsArray.push(appointment);
	});

	return appointmentsArray;
};

const getAppointments = async (req, res, next) => {
	try {
		const id = await req.query.id;

		const appointmentsArray = _getAppointments(id);
		res.json(appointmentsArray);
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const getAppointment = async (req, res, next) => {
	try {
		const id = req.query.id;
		const appointment = await firestore.collection("Appointments").doc(id);
		const data = await appointment.get();

		if (data.exists) {
			res.status(200).json(data.data());
		} else {
			res.status(400).json("Appointment with the given id not found");
		}
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const updateAppointment = async (req, res, next) => {
	try {
		const id = req.query.id;
		const data = req.body;

		const doctorId = data.doctorId;

		if (!doctorId || !data.horario) {
			res.status(400).json(
				"No se puede realizar la comunicacion con el servidor. Doctor ID o horario faltante."
			);
			return;
		}

		data.horario = new Date(data.horario);

		if (await overlaps(data.horario, doctorId)) {
			res.status(400).json(
				"El horario seleccionado se encuentra ocupado."
			);
			return;
		}

		const appointment = firestore.collection("Appointments").doc(id);
		await appointment.update(data);
		res.json("Appointment record updated successfully");
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const deleteAppointment = async (req, res, next) => {
	try {
		const id = req.query.id;
		await firestore.collection("Appointments").doc(id).delete();
		res.json("Record deleted successfully");
	} catch (error) {
		res.status(400).json(error.message);
	}
};

module.exports = {
	addAppointment,
	getAppointments,
	getAppointment,
	updateAppointment,
	deleteAppointment,
};
