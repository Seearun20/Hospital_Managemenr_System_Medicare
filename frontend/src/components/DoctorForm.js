import React from 'react';

function DoctorForm({ name, setName, specialization, setSpecialization, addDoctor }) {
  return (
    <div>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Specialization" onChange={e => setSpecialization(e.target.value)} />
      <button onClick={addDoctor}>Add</button>
    </div>
  );
}

export default DoctorForm;