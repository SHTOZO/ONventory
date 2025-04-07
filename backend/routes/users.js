const express = require('express');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth'); // Assuming adminOnly middleware

const router = express.Router();

// Get all staff members (admin only)
router.get('/staff', auth, adminOnly, async (req, res) => {
    try {
      const staff = await User.find({ role: 'staff' }); // Fetch staff based on role
      res.status(200).json(staff);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching staff', error: err });
    }
  });

// Delete a staff member (admin only)
router.delete('/staff/:id', auth, adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStaff = await User.findByIdAndDelete(id);
    if (!deletedStaff) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting staff member', error: err });
  }
});

module.exports = router;