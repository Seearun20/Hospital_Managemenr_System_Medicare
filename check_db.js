const mongoose = require('mongoose');
const uri = 'mongodb+srv://seearun20:rD8z9A56Jg46J9A0@cluster0.bpt1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.useDb('auth');
  const User = db.model('User', new mongoose.Schema({}, { strict: false }));
  
  const users = await User.find({});
  console.log("Found users:", users.length);
  for (let u of users) {
    console.log(`Email: ${u.email}, isVerified: ${u.isVerified}, passwordLength: ${u.password?.length}, role: ${u.role}`);
  }
  process.exit(0);
}

check();
