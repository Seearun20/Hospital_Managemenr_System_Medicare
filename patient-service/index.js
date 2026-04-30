const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');

const app = express();
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
mongoose.connect('mongodb+srv://sainiyuvraj723926:sainiyuvraj12345@cluster0.g3zcyoj.mongodb.net/hms')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* =========================
   Redis Connection (Edge Cache)
========================= */
const client = redis.createClient({
  url: 'redis://redis:6379'
});

client.connect()
  .then(() => console.log("Redis connected"))
  .catch(err => console.log(err));

/* =========================
   Schema
========================= */
const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String },
  phone: { type: String },
  email: { type: String },
  bloodGroup: { type: String }
});

const Patient = mongoose.model('Patient', PatientSchema);

/* =========================
   Add Patient
========================= */
app.post('/patients', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();

    // 🔥 Clear cache when new data added
    await client.del('patients');

    res.send({ message: 'Patient saved' });

  } catch (err) {
    res.status(500).send(err);
  }
});

/* =========================
   Get Patients (with Redis Cache)
========================= */
app.get('/patients', async (req, res) => {
  try {
    // 🔥 Check cache first
    const cached = await client.get('patients');

    if (cached) {
      console.log("Serving from Redis cache");
      return res.send(JSON.parse(cached));
    }

    // 🔥 Fetch from MongoDB
    const patients = await Patient.find();

    // 🔥 Store in cache
    await client.set('patients', JSON.stringify(patients));

    res.send(patients);

  } catch (err) {
    res.status(500).send(err);
  }
});

/* =========================
   Update Patient
========================= */
app.put('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).send({ message: 'Patient not found' });
    await client.del('patients');
    res.send({ message: 'Patient updated', patient });
  } catch (err) {
    res.status(500).send(err);
  }
});

/* =========================
   Delete Patient
========================= */
app.delete('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).send({ message: 'Patient not found' });
    await client.del('patients');
    res.send({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

/* =========================
   Start Server
========================= */
app.listen(3002, '0.0.0.0', () => {
  console.log("Patient Service running");
});