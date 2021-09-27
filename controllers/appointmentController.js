"use strict";

const firebase = require("../db");
const Appointment = require("../models/appointment");
const firestore = firebase.firestore();


const addAppointment = async(req, res, next) => {
    try {
        const data = req.body;
        data.horario = new Date(data.horario);
        const response = await firestore.collection("Appointments").add(data);
        res.json(response.id);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAppointments = async(req, res, next) => {
    try {
        const id = await req.query.id;

        const appointments = await firestore
            .collection("Appointments")
            .where("doctorId", "==", id);

        const data = await appointments.get();

        const appointmentsArray = [];

        if (data.empty) {
            res.status(400).json(error.message);
        } else {
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
            res.json(appointmentsArray);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAppointment = async(req, res, next) => {
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
}

const updateAppointment = async(req, res, next) => {
    try {
        const id = req.query.id;
        const data = req.body;
        data.horario = new Date(data.horario);
        const appointment = await firestore.collection("Appointments").doc(id);
        await appointment.update(data);
        res.json("Appointment record updated successfully");
    } catch (error) {
        res.status(400).json(error.message);
    }
}

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
    deleteAppointment
}
