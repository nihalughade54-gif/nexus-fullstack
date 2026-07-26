import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

export default function Navbar({ search, onSearchChange }) {
  const { count, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">N</span>
          <span className="brand-name">NEXUS</span>
        </Link>

        <div className="search-box">
          <Search size={16} strokeWidth={2.2} />
          <input
            type="text"
            placeholder="Search products, brands, categories…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
          />
        </div>

        <nav className="nav-actions">
          {user ? (
            <div className="user-menu" onMouseLeave={() => setMenuOpen(false)}>
              <button className="icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Account menu">
                <User size={20} />
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <p className="dropdown-greeting">Hi, {user.name.split(' ')[0]}</p>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate('/');
                    }}
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="icon-btn" aria-label="Sign in">
              <User size={20} />
            </Link>
          )}

          <button className="icon-btn cart-btn" onClick={() => setIsOpen(true)} aria-label="Open cart">
            <ShoppingBag size={20} />
            {count > 0 && <span className="cart-count">{count}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}
