function Message(nombreCita, motivo, comentarios, patientName, doctorName, horario, gap, toPhone, fromPhone) {
    this.nombreCita = nombreCita;
    this.motivo = motivo;
    this.comentarios = comentarios;
    this.patientName = patientName;
    this.doctorName = doctorName;
    this.horario = horario;
    this.gap = gap;
    this.toPhone = toPhone;
    this.fromPhone = fromPhone;
}

module.exports = Message;