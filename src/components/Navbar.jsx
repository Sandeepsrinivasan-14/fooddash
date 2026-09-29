import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getValidOrders } from '../services/utils';
import Icon from './Icon';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/orders', label: 'Orders', icon: 'package' },
  { to: '/restaurants', label: 'Restaurants', icon: 'store' },
  { to: '/filter', label: 'Search', icon: 'search' },
  { to: '/stats', label: 'Analytics', icon: 'barChart' },
];

export default function Navbar() {
  const { state, dispatch } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const pending = getValidOrders(state.orders).filter(o => o.status?.toLowerCase() === 'pending').length;

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-brand-icon"><Icon name="utensils" size={20} /></span>
          FoodDash
        </div>

        <div className="nav-links">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon"><Icon name={icon} size={16} /></span>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          {pending > 0 && (
            <NavLink to="/orders" className="nav-badge" style={{ textDecoration: 'none' }}>
              <span className="pulse-dot" />
              {pending} pending
            </NavLink>
          )}
          <button
            className="theme-toggle"
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            title="Toggle dark/light mode"
          >
            <Icon name={state.theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>

          {/* Mobile menu button */}
          <button
            className="theme-toggle"
            onClick={() => setMenuOpen(v => !v)}
            style={{ display: 'none' }}
            id="mobile-menu-btn"
          >
            <Icon name="menu" size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, zIndex: 99,
          background: 'var(--surface-solid)', borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)', padding: '1rem',
          display: 'flex', flexDirection: 'column', gap: '0.25rem',
        }}>
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
              style={{ padding: '0.75rem 1rem' }}
            >
              <span style={{ display: 'inline-flex' }}><Icon name={icon} size={16} /></span> {label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}
