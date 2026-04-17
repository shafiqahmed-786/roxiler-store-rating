import { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(res.data);
    } catch {
      toast.error('Failed to load users');
    }
  };

  const fetchStores = async () => {
    try {
      const res = await API.get('/stores', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStores(res.data);
    } catch {
      toast.error('Failed to load stores');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, []);

  // 🔥 Pagination logic
  const itemsPerPage = 6;
  const paginatedUsers = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="content">
      <h2>Admin Dashboard</h2>

      {/* USERS */}
      <h3>Users</h3>
      <div className="grid">
        {paginatedUsers.map(u => (
          <motion.div whileHover={{ scale: 1.05 }} className="card" key={u.id}>
            <p><b>{u.name}</b></p>
            <p>{u.email}</p>
            <p>{u.role}</p>
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
        <span style={{ margin: '0 10px' }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {/* STORES */}
      <h3 style={{ marginTop: 30 }}>Stores</h3>
      <div className="grid">
        {stores.map(s => (
          <motion.div whileHover={{ scale: 1.05 }} className="card" key={s.id}>
            <p><b>{s.name}</b></p>
            <p>{s.address}</p>
            <p>⭐ {s.average_rating}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}