async function run() {
  try {
    const email = 'testuser123@gmail.com';
    const password = 'Password123!';
    
    console.log('1. Signing up...');
    let res = await fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName: 'Test', lastName: 'User', role: 'admin' })
    });
    console.log(await res.json());
    
    console.log('2. Fetching OTP from DB...');
    const mongoose = require('mongoose');
    await mongoose.connect('mongodb+srv://sainiyuvraj723926:sainiyuvraj12345@cluster0.g3zcyoj.mongodb.net/hms');
    const User = mongoose.model('User', new mongoose.Schema({}, {strict:false}));
    const u = await User.findOne({email});
    console.log('OTP:', u.otp);
    
    console.log('3. Verifying Signup...');
    res = await fetch('http://localhost:3001/verify-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: u.otp })
    });
    console.log(await res.json());
    
    console.log('4. Logging in...');
    res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    console.log('Login Result:', await res.json());
    
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}

run();
