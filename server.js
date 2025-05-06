const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const patientsFile = './data/patients.json';
const rdvFile = './data/rendezvous.json';

// 🧑‍⚕️ Patients

app.get('/api/patients', async (req, res) => {
  const data = await fs.readJson(patientsFile);
  res.json(data);
});

app.post('/api/patients', async (req, res) => {
  const patient = req.body;
  const data = await fs.readJson(patientsFile);
  data.push(patient);
  await fs.writeJson(patientsFile, data, { spaces: 2 });
  res.status(201).json({ message: 'Patient ajouté !' });
});

// 📅 Rendez-vous

app.get('/api/rendezvous', async (req, res) => {
  const data = await fs.readJson(rdvFile);
  res.json(data);
});

app.post('/api/rendezvous', async (req, res) => {
  const rdv = req.body;
  const data = await fs.readJson(rdvFile);
  data.push(rdv);
  await fs.writeJson(rdvFile, data, { spaces: 2 });
  res.status(201).json({ message: 'Rendez-vous ajouté !' });
});

app.listen(PORT, () => {
  console.log(`API en ligne sur http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API du cabinet médical');
});

