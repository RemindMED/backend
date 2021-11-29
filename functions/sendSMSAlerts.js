const firebase = require("../db");
const Appointment = require("../models/appointment");
const firestore = firebase.firestore();
const Message = require("../models/message");
var settings = { timestampsInSnapshots: true }; // force Timestamp instead of Date
firestore.settings(settings);
const config = require("../config");

const Twilio = require('twilio');;



async function sendSMSAlerts(gap) {
	const nearAppointments = await getNearAppointments(gap);
	const messages = await generateMessages(nearAppointments, gap);
	await sendSMSNotifications(messages);
}

function addMinutes(date, minutes) {
	return new Date(date.getTime() + minutes * 60000);
}

async function sendSMSNotifications(messages) {
    if (!messages) return;

	const client = new Twilio(config.twilio_accout_sid, config.twilio_auth_token);
	messages.forEach(function (message) {
		// Create options to send the message
		const options = {
			to: `+52${message.toPhone}`,
			from: `${message.fromPhone}`,
			/* eslint-disable max-len */
			body: `Buen dia ${
				message.patientName
			}. Este mensaje es para recordarle que tiene una cita (${
				message.nombreCita
			}) con el doctor ${message.doctorName}. El dia de hoy a las ${
				message.horario
			}`,
			/* eslint-enable max-len */
		};

		// Send the message!
		client.messages.create(options, function (err, response) {
			if (err) {
				// Just log it for now
				console.error(err);
			} else {
				// Log the last few digits of a phone number
				console.log(`Message sent to ${message.toPhone}`);
			}
		});
	});

}

async function getPatient(patiendId) {
	try {
		const patientData = firestore.collection("Patients").doc(patiendId);
		const patient = await patientData.get();

		if (!patient.exists) return null;
		return patient.data();
	} catch (error) {
		return null;
	}
}

async function getDoctor(doctorId) {
	try {
		const doctorData = firestore.collection("Doctors").where("doctorId", "==", doctorId);
		const doctor = await doctorData.get();

		// if (!doctor.exists) return null;
        let doctors = [];
        doctor.forEach((doc) => {
            doctors.push(doc.data());
        });
		return doctors ? doctors[0] : null;
	} catch (error) {
		return null;
	}
}

async function generateMessages(appointments, gap) {
	if (!appointments) return [];

	var messages = [];
     for (const ap of appointments) {
		try {
			const patient = await getPatient(ap.pacienteId);
			const doctor = await getDoctor(ap.doctorId);


			if (!patient || !doctor) return;

			const message = new Message(
				ap.nombre,
				ap.motivo,
				ap.comentarios,
				patient.nombre,
				doctor.nombre + " " + doctor.apellido,
				ap.horario ? ap.horario.toDate().toLocaleTimeString() : "00:00",
				gap,
				patient.celular,
				config.twilio_phone_number
			);
			messages.push(message);

		} catch (err) {
			return;
		}
	}

	return messages;
}

async function getNearAppointments(gap) {
	try {
		const nearAppointments = firestore
			.collection("Appointments")
			.where("horario", ">=", addMinutes(new Date(), gap-1))
			.where("horario", "<=", addMinutes(new Date(), gap));

		const data = await nearAppointments.get();

		const appointmentsArray = [];

		if (data.empty) return [];

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
	} catch (error) {
		return [];
	}
}

module.exports = sendSMSAlerts;
