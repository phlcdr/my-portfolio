import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>STUDIO_AUTHENTICATION // V1.0.4</h1>
        {error && <div className="login-error">{error}</div>}
        
        <div className="login-group">
          <label>ID_IDENTIFIER</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            placeholder="Username"
          />
        </div>

        <div className="login-group">
          <label>SECURITY_KEY</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          className="login-btn-it" 
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'SYNCING_GATEWAY...' : 'INITIALIZE_SESSION'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
