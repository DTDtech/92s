
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTools, faShoppingCart, faCalendar } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar bg-dark text-white p-4 vh-100">
      <h2 className="text-center mb-4">92S Rental</h2>
      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/" 
          className={`text-white ${location.pathname === '/' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faHome} /> Dashboard
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/equipment" 
          className={`text-white ${location.pathname === '/equipment' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faTools} /> Equipment
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/orders" 
          className={`text-white ${location.pathname === '/orders' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faShoppingCart} /> Orders
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/calendar" 
          className={`text-white ${location.pathname === '/calendar' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faCalendar} /> Calendar
        </Nav.Link>
      </Nav>
    </div>
  );
}
