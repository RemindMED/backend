function trimField(field) {
	try {
		let f = field.trim();
		return f;
	} catch (err) {
		return field;
	}
}

function trimFields(object) {
	for (const key in object) {
		object[key] = trimField(object[key]);
	}
}

module.exports = trimFields;