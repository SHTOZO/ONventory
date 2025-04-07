const express = require('express');
const Item = require('../models/Item');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Create a new item (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  const { name, quantity, category, price,  } = req.body;
  const { organization } = req.user;

  try {
    const newItem = new Item({ name, quantity, category, price, organization });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Error creating item', error: err });
  }
});

// Get all items (any authenticated user)
router.get('/', auth, async (req, res) => {
    try {
      const { organization } = req.user;  // Get the organization from the user's token
  
      // Find all items belonging to the user's organization
      const items = await Item.find({ organization });
  
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching items', error: err });
    }
  });

// Update an item (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
    const { id } = req.params;
    const { name, quantity, category, price } = req.body;
    const { organization } = req.user;  // Get the organization from the user's token
  
    try {
      // Find the item and ensure it's in the logged-in user's organization
      const updatedItem = await Item.findOneAndUpdate(
        { _id: id, organization },  // Only allow update if the item belongs to the user's organization
        { name, quantity, category, price },
        { new: true }
      );
  
      if (!updatedItem) return res.status(404).json({ message: 'Item not found or unauthorized' });
  
      res.status(200).json(updatedItem);
    } catch (err) {
      res.status(500).json({ message: 'Error updating item', error: err });
    }
  });

// Delete an item (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
    const { id } = req.params;
    const { organization } = req.user;  // Get the organization from the user's token
  
    try {
      // Find and delete the item if it belongs to the user's organization
      const deletedItem = await Item.findOneAndDelete({ _id: id, organization });
  
      if (!deletedItem) return res.status(404).json({ message: 'Item not found or unauthorized' });
  
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting item', error: err });
    }
  });

module.exports = router;