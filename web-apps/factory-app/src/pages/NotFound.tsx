import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.text}>Page Not Found</p>
      <Link to="/" style={styles.link}>
        Back to Home
      </Link>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '90vh',
    textAlign: 'center',
  },
  title: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    backgroundColor: '#007bff',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
  },
};

export default NotFound;