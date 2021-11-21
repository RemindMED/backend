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

module.exports = {
	isValidPhone,
	containsOnlyChars,
    isValidPassword,
};
