const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
mongoose.connect('mongodb+srv://sainiyuvraj723926:sainiyuvraj12345@cluster0.g3zcyoj.mongodb.net/hms')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* =========================
   Schema
========================= */
const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  experience: { type: String }
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

// Add doctor
app.post('/doctors', async (req, res) => {
  try {
    const { name, specialization } = req.body;

    if (!name || !specialization) {
      return res.status(400).send({ error: "Missing fields" });
    }

    const doctor = new Doctor(req.body);

    await doctor.save();

    res.send({ message: 'Doctor added', doctor });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Get doctors
app.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.send(doctors);
  } catch (err) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Update doctor
app.put('/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).send({ error: 'Doctor not found' });
    res.send({ message: 'Doctor updated', doctor });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Delete doctor
app.delete('/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).send({ error: 'Doctor not found' });
    res.send({ message: 'Doctor deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(3003, '0.0.0.0', () => console.log('Doctor Service running'));