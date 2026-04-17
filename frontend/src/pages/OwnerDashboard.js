import { useEffect, useState } from 'react';
import API from '../api';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function OwnerDashboard() {
  const [ratings, setRatings] = useState([]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/owner/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRatings(res.data);
    } catch {
      toast.error('Failed to load dashboard');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="content">
      <h2>Owner Dashboard</h2>

      {/* RATINGS LIST */}
      <div className="grid">
        {ratings.map((r, i) => (
          <motion.div whileHover={{ scale: 1.05 }} className="card" key={i}>
            <p><b>{r.user_name}</b></p>
            <p>⭐ {r.rating}</p>
          </motion.div>
        ))}
      </div>

      {/* CHART */}
      <h3 style={{ marginTop: 30 }}>Ratings Chart</h3>

      <Bar
        data={{
          labels: ratings.map((r, i) => `User ${i + 1}`),
          datasets: [
            {
              label: 'Ratings',
              data: ratings.map(r => r.rating)
            }
          ]
        }}
      />
    </div>
  );
}