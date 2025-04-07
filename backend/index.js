require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { auth, adminOnly } = require('./middleware/auth');
const itemRoutes = require('./routes/Items');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Inventory Backend Running!');
});
app.get('/api/protected', auth, (req, res) => {
    res.json({ message: `Hello ${req.user.role}, you're authorized under ${req.user.organization}!` });
  });
  app.get('/api/admin', auth, adminOnly, (req, res) => {
    res.json({ message: `Hello Admin ${req.user.id}, you're authorized under ${req.user.organization}!` });
  });

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
  .catch((err) => console.log(err));