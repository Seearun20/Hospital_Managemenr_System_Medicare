const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email provider
  auth: {
    user: 'seearun20@gmail.com', // Replace with your real email
    pass: 'ifjc gppf lijo wtwz'     // Replace with your real email app password
  }
});
console.log('Nodemailer SMTP configured. Ready to send emails.');

/* =========================
   MongoDB Connection
========================= */
mongoose.connect('mongodb+srv://sainiyuvraj723926:sainiyuvraj12345@cluster0.g3zcyoj.mongodb.net/hms')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* =========================
   Schema
========================= */
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, default: 'admin' },
  otp: { type: String },
  otpExpiry: { type: Date },
  inviteToken: { type: String }
});

const User = mongoose.model('User', UserSchema);

/* =========================
   Signup
========================= */
app.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'admin'
    });

    await user.save();

    res.send({ message: 'User registered' });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   Login
========================= */
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send({ message: 'Invalid credentials' });

    if (!user.password || user.password === 'invited') return res.status(401).send({ message: 'Please set your password first using the link sent to your email.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
      'secret',
      { expiresIn: '1h' }
    );

    res.send({ token });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

/* =========================
   Invite / Set Password
========================= */
const crypto = require('crypto');

app.post('/invite', async (req, res) => {
  try {
    const { email, firstName, lastName, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).send({ message: 'User already exists.' });

    const inviteToken = crypto.randomBytes(32).toString('hex');
    
    user = new User({
      email,
      firstName,
      lastName,
      role,
      password: 'invited', // placeholder
      inviteToken
    });
    
    await user.save();

    if (transporter) {
      await transporter.sendMail({
        from: '"MediCore Admin" <seearun20@gmail.com>',
        to: email,
        subject: 'Welcome to MediCore! Set your password',
        text: `Hello ${firstName},\n\nYou have been registered on MediCore as a ${role}. Please click the link below to set up your password:\n\nhttp://localhost:3000/set-password?token=${inviteToken}\n\nWelcome aboard!`
      });
      console.log('Invite sent to', email);
    }

    res.send({ message: 'Invite sent successfully.' });
  } catch (err) {
    console.error('Invite Error:', err);
    res.status(500).send({ message: err.message });
  }
});

app.post('/set-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).send({ message: 'Token and password required.' });

    const user = await User.findOne({ inviteToken: token });
    if (!user) return res.status(400).send({ message: 'Invalid or expired invite token.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.inviteToken = undefined;
    await user.save();

    res.send({ message: 'Password set successfully. You can now login.' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

/* =========================
   OTP Endpoints
========================= */
app.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: 'No account found with this email.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60000); // 10 mins
    await user.save();

    if (transporter) {
      await transporter.sendMail({
        from: '"MediCore Security" <seearun20@gmail.com>', // Match the auth user
        to: email,
        subject: 'Your Login Verification Code',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`
      });
      console.log('OTP sent successfully to', email);
    }
    
    res.send({ message: 'OTP sent to email successfully.' });
  } catch (err) {
    console.error('SMTP ERROR:', err);
    res.status(500).send({ message: 'SMTP Configuration Error: ' + err.message });
  }
});

app.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: 'User not found' });

    if (!user.otp || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(401).send({ message: 'Invalid or expired OTP code.' });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
      'secret',
      { expiresIn: '1h' }
    );
    res.send({ token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

/* =========================
   Start Server
========================= */
app.listen(3001, '0.0.0.0', () => {
  console.log('Auth Service running');
});