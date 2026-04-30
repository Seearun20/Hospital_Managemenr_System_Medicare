import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Signup from './pages/Signup';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import SetPassword from './pages/SetPassword';







function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;