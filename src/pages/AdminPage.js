import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from '../components/Admin/AdminLogin';
import AdminDashboard from '../components/Admin/AdminDashboard';
import './Admin.css';

const AdminPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="admin-loading">Verifying Authorization...</div>;
  }

  return (
    <div className="admin-page">
      {!user ? <AdminLogin /> : <AdminDashboard />}
    </div>
  );
};

export default AdminPage;
