const express4 = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app4 = express4();
app4.use(express4.json());

/* =========================
   MongoDB Connection
========================= */
mongoose.connect('mongodb+srv://sainiyuvraj723926:sainiyuvraj12345@cluster0.g3zcyoj.mongodb.net/hms')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* =========================
   Schema
========================= */
const AppointmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  date: { type: String },
  time: { type: String },
  reason: { type: String },
  status: { type: String, default: 'scheduled' },
  vitals: {
    bp: String,
    pulse: String,
    temp: String,
    weight: String
  },
  clinicalNotes: String,
  prescription: String
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

app4.post('/appointments', async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    // Example inter-service call
    await axios.get('http://patient-service:3002/patients');

    const appointment = new Appointment(req.body);

    await appointment.save();
    
    res.send({ message: 'Appointment booked', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app4.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.send(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app4.put('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) return res.status(404).send({ error: 'Appointment not found' });
    res.send({ message: 'Appointment updated', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app4.delete('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).send({ error: 'Appointment not found' });
    res.send({ message: 'Appointment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app4.listen(3004, '0.0.0.0', () => console.log('Appointment Service running'));