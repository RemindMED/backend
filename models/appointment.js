function Appointment(id, nombre, pacienteId, doctorId, motivo, horario, comentarios) {
    this.id = id;
    this.nombre = nombre;
    this.pacienteId = pacienteId;
    this.doctorId = doctorId;
    this.motivo = motivo;
    this.horario = horario;
    this.comentarios = comentarios;
}

module.exports = Appointment;