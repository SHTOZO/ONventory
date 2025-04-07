import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Items = ({ token }) => {
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(null);  // For managing editing state
  const [editedItem, setEditedItem] = useState({
    name: '',
    quantity: '',
    price: '',
  });
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    price: '',
  });

  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('All');

  useEffect(() => {

    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role); // Set the role from the decoded token
    }
    fetchItems();
  }, [token]);

  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filterValue === 'priceLowToHigh') {
        return a.price - b.price; // Sort by price low to high
      }
      if (filterValue === 'priceHighToLow') {
        return b.price - a.price; // Sort by price high to low
      }
      if (filterValue === 'stockLowToHigh') {
        return a.quantity - b.quantity;
      }
      if (filterValue === 'stockHighToLow') {
        return b.quantity - a.quantity;
      }
      return 0;
    });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Item deleted successfully!');
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  const handleEdit = (item) => {
    setIsEditing(item._id); // Set the item ID as editing
    setEditedItem({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/items/${isEditing}`,
        editedItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Item updated successfully!');
      setIsEditing(null); // Clear the editing state
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item');
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/items',
        newItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Item added successfully!');
      setNewItem({ name: '', quantity: '', price: '' }); // Clear form
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item');
    }
  };

  return (
    <div>
      {/* Show Add Item form only if user is admin */}
      {userRole === 'admin' && (
        <div>
          <h2>Add Item</h2>
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <button onClick={handleAddItem}>Add Item</button>
        </div>
      )}
      <h2>Item List</h2>  
      {/* Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search items"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      {/* Filter Dropdown for Price Sorting */}
      <div>
        <label htmlFor="filter">Filter:</label>
        <select
          id="filter"
          value={filterValue}
          onChange={handleFilterChange}
        >
          <option value="priceLowToHigh">Price Low to High</option>
          <option value="priceHighToLow">Price High to Low</option>
          <option value="stockLowToHigh">Stock Low to High</option>
          <option value="stockHighToLow">Stock High to Low</option>
        </select>
      </div>
      <ul>
        {filteredItems.map((item) => (
          <li key={item._id}>
            {isEditing === item._id ? (
              <div>
                <input
                  type="text"
                  value={editedItem.name}
                  onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editedItem.quantity}
                  onChange={(e) => setEditedItem({ ...editedItem, quantity: e.target.value })}
                />
                <input
                  type="number"
                  value={editedItem.price}
                  onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setIsEditing(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {item.name} - {item.quantity} - ${item.price} - {item.organization}
                {/* Show Edit/Delete buttons only if the user is an admin */}
                {userRole === 'admin' && (
                  <>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;