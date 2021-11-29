const trimFields = require("./trimFields");

function isValidPhone(phone) {
	var regex = /^\d{10}$/;
	return regex.test(phone);
}

function containsOnlyChars(phone) {
	var regex = /^[a-zA-Z èàùìòÈÀÒÙÌéáúíóÉÁÚÍÓëäüïöËÄÜÏÖêâûîôÊÂÛÎÔç'-]*$/;
	return regex.test(phone);
}

function isValidPassword(password) {
	var hasCaps = password.toLowerCase() !== password;
	var SpecialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

	return hasCaps && SpecialCharRegex.test(password) && password.length >= 6;
}

function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePatientForm(req) {
	trimFields(req.body);

	const {
		nombre,
		apellido,
		email,
		celular,
		fechaNacimiento,
		edad,
		sexo,
		doctorId,
		foto,
	} = req.body;

	let errores = "";
	let camposFaltantes = "<ul>";
	if (!nombre) camposFaltantes += "<li> Nombre(s) </li>";
	if (!apellido) camposFaltantes += "<li> Apellido(s) </li>";
	if (!email) camposFaltantes += "<li> Email </li>";
	if (!celular) camposFaltantes += "<li> Celular </li>";
	if (!fechaNacimiento) camposFaltantes += "<li> Fecha de nacimiento </li>";
	if (!sexo) camposFaltantes += "<li> Sexo </li>";

	if (camposFaltantes != "<ul>")
		errores += "Campos faltantes/incompletos:" + camposFaltantes + "</ul>";

	// validacion de contenido dentro de campos
	if (!isValidPhone(celular))
		errores +=
			"<li> El <strong>Celular</strong> no es valido. Debe contener unicamente un total de 10 digitos </li>";

    if (!isValidEmail(email)) {
        errores += "<li> El <strong>Email</strong> no es valido </li>";
    }

	if (!containsOnlyChars(nombre))
		errores +=
			"<li> El campo de <strong>Nombre(s)</strong> debe contener unicamente letras</li>";
	if (!containsOnlyChars(apellido))
		errores +=
			"<li> El campo de <strong>Apellido(s) </strong> debe contener unicamente letras</li>";

	if (fechaNacimiento && new Date(fechaNacimiento) > new Date())
		errores +=
			"<li> La <strong>Fecha de Nacimiento</strong> debe ser previa al dia de hoy.</li>";

	return errores;
}

module.exports = {
	isValidPhone,
	containsOnlyChars,
	isValidPassword,
	validatePatientForm,
};
