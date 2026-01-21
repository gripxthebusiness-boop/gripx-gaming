import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '10px' }}>
        <Link to="/privacy" style={{ color: '#60a5fa', marginRight: '15px' }}>
          Privacy Policy
        </Link>
        <Link to="/terms" style={{ color: '#60a5fa' }}>
          Terms & Conditions
        </Link>
      </div>

      <p style={{ fontSize: '14px', opacity: 0.8 }}>
        © {new Date().getFullYear()} GripX Gaming. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
