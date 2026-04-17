import { useState } from 'react';
import API from './api';
import './App.css';

function App() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    storeName: '',
    storeEmail: '',
    storeAddress: ''
  });

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');

  const [ownerData, setOwnerData] = useState([]);
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', {
        email: form.email,
        password: form.password
      });

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      alert('Login successful');
    } catch (err) {
      console.log(err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  // 🆕 SIGNUP
  const handleSignup = async () => {
    try {
      await API.post('/auth/register', form);
      alert('Account created! Now login.');
      setMode('login');
    } catch (err) {
      console.log(err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  // 🏪 FETCH STORES
  const fetchStores = async () => {
    try {
      const res = await API.get('/stores', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: { name: search }
      });

      let data = res.data;

      if (sort === 'rating') {
        data.sort((a, b) => b.average_rating - a.average_rating);
      } else {
        data.sort((a, b) => a.name.localeCompare(b.name));
      }

      setStores(data);
    } catch {
      alert('Error fetching stores');
    }
  };

  // ⭐ RATE OR UPDATE
  const rateStore = async (store_id, rating) => {
    try {
      await API.post(
        '/ratings',
        { store_id, rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Rated!');
    } catch {
      await API.put(
        `/ratings/${store_id}`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Rating updated!');
    }

    fetchStores();
  };

  // 👑 OWNER DASHBOARD
  const loadOwnerDashboard = async () => {
    try {
      const res = await API.get('/owner/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setOwnerData(res.data);
    } catch {
      alert('Error loading dashboard');
    }
  };

  // 🧾 ADMIN → USERS
  const loadUsers = async () => {
    try {
      const res = await API.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUsers(res.data);
    } catch {
      alert('Error fetching users');
    }
  };

  return (
    <div className="container">
      {/* 🔥 UPDATED TITLE */}
      <h1 className="title">Roxiler Dashboard 🚀</h1>

      {/* AUTH */}
      <div className="card">
        <h2>{mode === 'login' ? 'Login' : 'Signup'}</h2>

        {mode === 'signup' && (
          <>
            <input className="input" name="name" placeholder="Full Name" onChange={handleChange} />
            <input className="input" name="address" placeholder="Address" onChange={handleChange} />
          </>
        )}

        <input className="input" name="email" placeholder="Email" onChange={handleChange} />
        <input className="input" type="password" name="password" placeholder="Password" onChange={handleChange} />

        {mode === 'login' ? (
          <button className="btn" onClick={handleLogin}>Login</button>
        ) : (
          <button className="btn" onClick={handleSignup}>Create Account</button>
        )}

        <p className="switch">
          {mode === 'login'
            ? <span onClick={() => setMode('signup')}>Create account</span>
            : <span onClick={() => setMode('login')}>Back to login</span>}
        </p>
      </div>

      {/* STORES */}
      {user && (
        <div className="card">
          <h2>Stores</h2>

          <input className="input" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />

          <select className="input" onChange={(e) => setSort(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </select>

          <button className="btn" onClick={fetchStores}>Load Stores</button>

          {/* 🔥 UPDATED GRID UI */}
          <div className="store-grid">
            {stores.map((store) => (
              <div key={store.id} className="store-card">
                <h3>{store.name}</h3>
                <p>{store.address}</p>
                <p>⭐ {store.average_rating}</p>

                <select onChange={(e) => rateStore(store.id, e.target.value)}>
                  <option>Rate</option>
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN */}
      {user?.role === 'ADMIN' && (
        <div className="card">
          <h2>Admin Panel</h2>

          <input className="input" placeholder="Store Name"
            onChange={(e) => setForm({ ...form, storeName: e.target.value })} />

          <input className="input" placeholder="Store Email"
            onChange={(e) => setForm({ ...form, storeEmail: e.target.value })} />

          <input className="input" placeholder="Store Address"
            onChange={(e) => setForm({ ...form, storeAddress: e.target.value })} />

          <button className="btn" onClick={async () => {
            try {
              await API.post('/admin/stores',
                {
                  name: form.storeName,
                  email: form.storeEmail,
                  address: form.storeAddress,
                  owner_id: user.id
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );
              alert('Store created!');
            } catch {
              alert('Error creating store');
            }
          }}>
            Create Store
          </button>

          {/* 🔥 UPDATED BUTTON SPACING */}
          <button className="btn" style={{ marginLeft: '10px' }} onClick={loadUsers}>
            View Users
          </button>

          {users.map(u => (
            <div key={u.id} className="store-card">
              <p>{u.name} ({u.role})</p>
              <p>{u.email}</p>
            </div>
          ))}
        </div>
      )}

      {/* OWNER */}
      {user?.role === 'STORE_OWNER' && (
        <div className="card">
          <h2>Owner Dashboard</h2>

          <button className="btn" onClick={loadOwnerDashboard}>
            Load Dashboard
          </button>

          {ownerData.map((r, i) => (
            <div key={i} className="store-card">
              <p>User: {r.user_name}</p>
              <p>Rating: ⭐ {r.rating}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './AdminDashboard';
import OwnerDashboard from './OwnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

export default App;