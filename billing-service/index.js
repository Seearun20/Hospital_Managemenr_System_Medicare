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
const BillingSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  amount: { type: Number, required: true },
  serviceType: { type: String },
  description: { type: String },
  paymentStatus: { type: String, default: 'unpaid' },
  createdAt: { type: Date, default: Date.now }
});

const Bill = mongoose.model('Bill', BillingSchema);

/* =========================
   Create Bill
========================= */
app.post('/billing', async (req, res) => {
  try {
    const bill = new Bill(req.body);

    await bill.save();

    res.send({ message: 'Bill generated' });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   Get Bills
========================= */
app.get('/billing', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.send(bills);
  } catch (err) {
    res.status(500).send(err);
  }
});

/* =========================
   Update Bill
========================= */
app.put('/billing/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bill) return res.status(404).send({ message: 'Bill not found' });
    res.send({ message: 'Bill updated', bill });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   Delete Bill
========================= */
app.delete('/billing/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).send({ message: 'Bill not found' });
    res.send({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   Start Server
========================= */
app.listen(3005, '0.0.0.0', () => {
  console.log('Billing Service running');
});