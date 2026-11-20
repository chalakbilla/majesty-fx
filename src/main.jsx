import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import './routes.css';

// Ensure demo admin session exists by default for instant dashboard access
if (!localStorage.getItem('majesty_admin_auth')) {
  localStorage.setItem(
    'majesty_admin_auth',
    JSON.stringify({
      authenticated: true,
      id: 999,
      email: 'demo@majestyfx.com',
      username: 'demoadmin',
      name: 'Demo Sandbox Admin',
      role: 'Super Admin',
      desk: 'demo',
      portal: 'Majesty FX Demo Sandbox Portal',
    })
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
