import { useEffect, useState } from 'react';
import API from '../api';

function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      const res = await API.get('/stores', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStores(res.data);
    };
    fetchStores();
  }, []);

  return (
    <div>
      <h2>Stores</h2>
      {stores.map(s => (
        <div key={s.id}>
          <h3>{s.name}</h3>
          <p>{s.address}</p>
          <p>Rating: {s.average_rating}</p>
        </div>
      ))}
    </div>
  );
}

export default Stores;