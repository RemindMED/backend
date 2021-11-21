"use strict";

const firebase = require("../db");
const firestore = firebase.firestore();
const trimFields = require("../functions/trimFields");
const {
	isValidPhone,
	containsOnlyChars,
	isValidPassword,
} = require("../functions/validation");
const auth = firebase.auth();

const addDoctor = async (req, res, next) => {
	try {
		trimFields(req.body);

		const {
			nombre,
			apellido,
			email,
			telefono,
			contrasena,
			conf_contrasena,
			especialidad,
		} = req.body;

		let errores = "";

		// validacion de campos faltantes
		let camposFaltantes = "<ul>";
		if (!nombre) camposFaltantes += "<li> Nombre(s) </li>";
		if (!apellido) camposFaltantes += "<li> Apellido(s) </li>";
		if (!email) camposFaltantes += "<li> Email </li>";
		if (!telefono) camposFaltantes += "<li> Numero telefonico </li>";
		if (!contrasena) camposFaltantes += "<li> Contrasena </li>";
		if (!conf_contrasena)
			camposFaltantes += "<li> Confirmar contrasena </li>";
		if (!especialidad) camposFaltantes += "<li> Especialidad </li>";

		if (camposFaltantes != "<ul>")
			errores += "Campos faltantes:" + camposFaltantes + "</ul>";

		// validacion de contenido dentro de campos
		if (contrasena != conf_contrasena)
			errores += "<li>Las contrasenas no coinciden </li>";

		if (!isValidPhone(telefono))
			errores +=
				"<li> El <strong>Numero Telefonico no es valido.</strong> Debe contener unicamente un total de 10 digitos </li>";

		if (!containsOnlyChars(nombre))
			errores +=
				"<li> El campo de <strong>Nombre(s)</strong> debe contener unicamente letras</li>";
		if (!containsOnlyChars(apellido))
			errores +=
				"<li> El campo de <strong>Apellido(s)</strong> debe contener unicamente letras</li>";
		if (!containsOnlyChars(especialidad))
			errores +=
				"<li> El campo de <strong>Especialidad</strong> debe contener unicamente letras</li>";

		if (!isValidPassword(contrasena))
			errores +=
				"<li> La contrasena debe ser mayor a 6 caracteres. Ademas de tener que contar por lo menos con una Mayuscula y un Caracter especial.</li>";

		if (errores) {
			res.status(400).json(errores);
			return;
		}

		const newUser = await auth.createUser({
			email: email,
			password: contrasena,
			displayName: nombre,
		});

		await firestore.collection("Doctors").doc().set({
			nombre,
			apellido,
			email,
			telefono,
			especialidad,
			doctorId: newUser.uid,
		});
		res.status(200).json({ doctorId: newUser.uid });
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const getDoctor = async (req, res, next) => {
	try {
		const id = req.params.doctorId;
		const doctor = await firestore.collection("Doctors").doc(id);
		const data = await doctor.get();

		if (data.exists) {
			res.status(200).json({ doctorId: data.id });
		} else {
			res.status(400).json("Doctor with the given id not found");
		}
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const updateDoctor = async (req, res, next) => {
	try {
		const id = req.params.id;
		const data = req.body;
		const patient = await firestore.collection("Doctors").doc(id);
		await patient.update(data);
		res.json("Patient record updated successfully");
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const deleteDoctor = async (req, res, next) => {
	try {
		const id = req.params.id;
		await firestore.collection("Doctors").doc(id).delete();
		res.json("Record deleted successfully");
	} catch (error) {
		res.status(400).json(error.message);
	}
};

module.exports = {
	addDoctor,
	getDoctor,
	updateDoctor,
	deleteDoctor,
};
