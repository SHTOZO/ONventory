import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const StaffList = ({ token }) => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the logged-in user is an admin
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.role === 'admin'); // Set admin status based on token
    }
  }, [token]);

  // Fetch staff members if the user is an admin
  useEffect(() => {
    if (isAdmin) {
      const fetchStaff = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/staff', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStaffMembers(response.data); // Store the staff data
        } catch (error) {
          console.error('Error fetching staff:', error);
        }
      };
      fetchStaff();
    }
  }, [token, isAdmin]);

  // Handle deleting a staff member
  const handleDelete = async (staffId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffMembers(staffMembers.filter((staff) => staff._id !== staffId)); // Remove deleted staff from UI
    } catch (error) {
      console.error('Error deleting staff member:', error);
    }
  };

  if (!isAdmin) {
    return <div>You do not have permission to view the staff list.</div>;
  }

  return (
    <div>
      <h2>Staff List</h2>
      <ul>
        {staffMembers.map((staff) => (
          <li key={staff._id}>
            {staff.username} - {staff.role}
            <button onClick={() => handleDelete(staff._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffList;