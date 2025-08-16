const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// In-memory data store
let dataStore = {
  donations: [],
  bloodRequests: [],
  bloodDrives: [],
  helpRequests: [],
  users: [],
  dashboard: {
    totalDonations: 0,
    pendingDonations: 0,
    completedDonations: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    upcomingDrives: 0,
    newUsers: 0,
    recentActivities: []
  }
};

// Generate mock data
function generateMockData() {
  // Generate mock donations
  for (let i = 1; i <= 20; i++) {
    dataStore.donations.push({
      id: `donation-${i}`,
      name: `Donor ${i}`,
      email: `donor${i}@example.com`,
      phone: `+1 (555) ${100 + i}-${1000 + i}`,
      bloodType: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
      donated: Math.random() > 0.5 ? 1 : 0,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      message: `Donation note ${i}`
    });
  }

  // Generate mock blood requests
  for (let i = 1; i <= 15; i++) {
    dataStore.bloodRequests.push({
      id: `request-${i}`,
      name: `Requester ${i}`,
      email: `requester${i}@example.com`,
      phone: `+1 (555) ${200 + i}-${2000 + i}`,
      bloodType: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
      units: Math.floor(Math.random() * 3) + 1,
      given: Math.random() > 0.7 ? 1 : 0,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      message: `Urgent need for blood type ${['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)]}`
    });
  }

  // Generate mock blood drives
  for (let i = 1; i <= 5; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + i * 7);
    
    dataStore.bloodDrives.push({
      id: `drive-${i}`,
      organizer: `Organization ${i}`,
      location: `Location ${i}, City`,
      startDate: startDate.toISOString(),
      endDate: new Date(startDate.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
      contactEmail: `org${i}@example.com`,
      contactPhone: `+1 (555) ${300 + i}-${3000 + i}`,
      done: 0,
      description: `Blood donation drive ${i} - Help save lives!`
    });
  }

  // Generate mock help requests
  for (let i = 1; i <= 10; i++) {
    dataStore.helpRequests.push({
      id: `help-${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      subject: `Help needed with ${['donation', 'request', 'account', 'other'][Math.floor(Math.random() * 4)]}`,
      message: `This is a help request #${i}. Please assist with my query.`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      answered: Math.random() > 0.5 ? 1 : 0
    });
  }

  // Generate mock users
  for (let i = 1; i <= 8; i++) {
    dataStore.users.push({
      id: `user-${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      role: i === 1 ? 'admin' : 'user',
      joined: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      checked: 0
    });
  }

  // Update dashboard stats
  updateDashboardStats();
}

// Update dashboard statistics
function updateDashboardStats() {
  dataStore.dashboard = {
    totalDonations: dataStore.donations.length,
    pendingDonations: dataStore.donations.filter(d => !d.donated).length,
    completedDonations: dataStore.donations.filter(d => d.donated).length,
    totalRequests: dataStore.bloodRequests.length,
    pendingRequests: dataStore.bloodRequests.filter(r => !r.given).length,
    completedRequests: dataStore.bloodRequests.filter(r => r.given).length,
    upcomingDrives: dataStore.bloodDrives.filter(d => !d.done).length,
    newUsers: dataStore.users.filter(u => !u.checked).length,
    recentActivities: [
      ...dataStore.donations.slice(0, 5).map(d => ({
        id: d.id,
        type: 'donation',
        title: `New donation from ${d.name}`,
        date: d.date,
        status: d.donated ? 'completed' : 'pending'
      })),
      ...dataStore.bloodRequests.slice(0, 5).map(r => ({
        id: r.id,
        type: 'request',
        title: `Blood request from ${r.name}`,
        date: r.date,
        status: r.given ? 'fulfilled' : 'pending'
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  };
}

// Initialize mock data
generateMockData();

// API Routes

// Dashboard
app.get('/api/dashboard', (req, res) => {
  res.json(dataStore.dashboard);
});

// Donate Blood
app.get('/api/donate-blood', (req, res) => {
  res.json(dataStore.donations);
});

app.post('/create-donate-blood', (req, res) => {
  const newDonation = {
    id: `donation-${Date.now()}`,
    ...req.body,
    donated: 0,
    date: new Date().toISOString()
  };
  dataStore.donations.unshift(newDonation);
  updateDashboardStats();
  res.status(201).json(newDonation);
});

app.put('/api/donate-blood/donated', (req, res) => {
  const { id, status } = req.body;
  const donation = dataStore.donations.find(d => d.id === id);
  if (donation) {
    donation.donated = status ? 1 : 0;
    updateDashboardStats();
    res.json(donation);
  } else {
    res.status(404).json({ error: 'Donation not found' });
  }
});

app.delete('/api/donate-blood/delete/:id', (req, res) => {
  const index = dataStore.donations.findIndex(d => d.id === req.params.id);
  if (index !== -1) {
    dataStore.donations.splice(index, 1);
    updateDashboardStats();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Donation not found' });
  }
});

app.put('/api/donate-blood/update/:id', (req, res) => {
  const index = dataStore.donations.findIndex(d => d.id === req.params.id);
  if (index !== -1) {
    dataStore.donations[index] = { ...dataStore.donations[index], ...req.body };
    updateDashboardStats();
    res.json(dataStore.donations[index]);
  } else {
    res.status(404).json({ error: 'Donation not found' });
  }
});

// Need Blood (similar structure as donate blood)
app.get('/api/need-blood', (req, res) => {
  res.json(dataStore.bloodRequests);
});

app.post('/create-need-blood', (req, res) => {
  const newRequest = {
    id: `request-${Date.now()}`,
    ...req.body,
    given: 0,
    date: new Date().toISOString()
  };
  dataStore.bloodRequests.unshift(newRequest);
  updateDashboardStats();
  res.status(201).json(newRequest);
});

app.put('/api/need-blood/given', (req, res) => {
  const { id, status } = req.body;
  const request = dataStore.bloodRequests.find(r => r.id === id);
  if (request) {
    request.given = status ? 1 : 0;
    updateDashboardStats();
    res.json(request);
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

app.delete('/api/need-blood/delete/:id', (req, res) => {
  const index = dataStore.bloodRequests.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    dataStore.bloodRequests.splice(index, 1);
    updateDashboardStats();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

app.put('/api/need-blood/update/:id', (req, res) => {
  const index = dataStore.bloodRequests.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    dataStore.bloodRequests[index] = { ...dataStore.bloodRequests[index], ...req.body };
    updateDashboardStats();
    res.json(dataStore.bloodRequests[index]);
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

// Host Blood Drive
app.get('/api/host-blood-drive', (req, res) => {
  res.json(dataStore.bloodDrives);
});

app.post('/create-host-blood-drive', (req, res) => {
  const newDrive = {
    id: `drive-${Date.now()}`,
    ...req.body,
    done: 0,
    startDate: req.body.startDate || new Date().toISOString(),
    endDate: req.body.endDate || new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
  };
  dataStore.bloodDrives.unshift(newDrive);
  updateDashboardStats();
  res.status(201).json(newDrive);
});

app.put('/api/host-blood-drive/done', (req, res) => {
  const { id, status } = req.body;
  const drive = dataStore.bloodDrives.find(d => d.id === id);
  if (drive) {
    drive.done = status ? 1 : 0;
    updateDashboardStats();
    res.json(drive);
  } else {
    res.status(404).json({ error: 'Blood drive not found' });
  }
});

app.delete('/api/host-blood-drive/delete/:id', (req, res) => {
  const index = dataStore.bloodDrives.findIndex(d => d.id === req.params.id);
  if (index !== -1) {
    dataStore.bloodDrives.splice(index, 1);
    updateDashboardStats();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Blood drive not found' });
  }
});

app.put('/api/host-blood-drive/update/:id', (req, res) => {
  const index = dataStore.bloodDrives.findIndex(d => d.id === req.params.id);
  if (index !== -1) {
    dataStore.bloodDrives[index] = { ...dataStore.bloodDrives[index], ...req.body };
    updateDashboardStats();
    res.json(dataStore.bloodDrives[index]);
  } else {
    res.status(404).json({ error: 'Blood drive not found' });
  }
});

// Need Help
app.get('/api/need-help', (req, res) => {
  res.json(dataStore.helpRequests);
});

app.post('/create-need-help', (req, res) => {
  const newHelp = {
    id: `help-${Date.now()}`,
    ...req.body,
    answered: 0,
    date: new Date().toISOString()
  };
  dataStore.helpRequests.unshift(newHelp);
  updateDashboardStats();
  res.status(201).json(newHelp);
});

app.put('/api/need-help/answered', (req, res) => {
  const { id, status } = req.body;
  const help = dataStore.helpRequests.find(h => h.id === id);
  if (help) {
    help.answered = status ? 1 : 0;
    updateDashboardStats();
    res.json(help);
  } else {
    res.status(404).json({ error: 'Help request not found' });
  }
});

app.delete('/api/need-help/delete/:id', (req, res) => {
  const index = dataStore.helpRequests.findIndex(h => h.id === req.params.id);
  if (index !== -1) {
    dataStore.helpRequests.splice(index, 1);
    updateDashboardStats();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Help request not found' });
  }
});

app.put('/api/need-help/update/:id', (req, res) => {
  const index = dataStore.helpRequests.findIndex(h => h.id === req.params.id);
  if (index !== -1) {
    dataStore.helpRequests[index] = { ...dataStore.helpRequests[index], ...req.body };
    updateDashboardStats();
    res.json(dataStore.helpRequests[index]);
  } else {
    res.status(404).json({ error: 'Help request not found' });
  }
});

// Users
app.get('/api/users', (req, res) => {
  res.json(dataStore.users);
});

app.post('/insert-new-users', (req, res) => {
  const newUser = {
    id: `user-${Date.now()}`,
    ...req.body,
    role: 'user',
    joined: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    checked: 0
  };
  dataStore.users.unshift(newUser);
  updateDashboardStats();
  res.status(201).json(newUser);
});

app.put('/api/new-users/checked', (req, res) => {
  const { id, status } = req.body;
  const user = dataStore.users.find(u => u.id === id);
  if (user) {
    user.checked = status ? 1 : 0;
    updateDashboardStats();
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
