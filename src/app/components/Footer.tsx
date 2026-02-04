import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#ffffff',
        color: '#111827',
        textAlign: 'center',
        borderTop: '1px solid #fecaca',
      }}
    >
      <div style={{ marginBottom: '10px' }}>
        <Link to="/privacy" style={{ color: '#dc2626', marginRight: '15px' }}>
          Privacy Policy
        </Link>
        <Link to="/terms" style={{ color: '#dc2626' }}>
          Terms & Conditions
        </Link>
      </div>

      <p style={{ fontSize: '14px', opacity: 0.8 }}>
        © {new Date().getFullYear()} NeoSell. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
