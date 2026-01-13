import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem('schoolUsers'));

    // If no users exist in localStorage, create a default admin user for first-time login.
    if (!users) {
      users = [{ id: 1, name: 'Admin User', email: 'admin', password: '123456', role: 'Admin', status: 'Active' }];
      localStorage.setItem('schoolUsers', JSON.stringify(users));
    }

    const user = users.find(u => u.email === username && u.password === password);

    if (user) {
      if (user.status === 'Active') {
        localStorage.setItem('userRole', user.role);
        navigate('/dashboard');
      } else {
        setError('This user account is inactive.');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="mb-4 text-center">
        <h1 className="fw-bold text-primary" style={{ letterSpacing: '2px', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>SCHOOL MANAGEMENT</h1>
      </div>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Sign In</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Email / Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;