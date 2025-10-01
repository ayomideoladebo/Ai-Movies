import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { SearchBar } from './SearchBar'
import { AuthModal } from './AuthModal'

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-heading font-bold text-white">MovieApp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/search" className="text-white/80 hover:text-white transition-colors">
              Search
            </Link>
            {user && (
              <Link to="/account" className="text-white/80 hover:text-white transition-colors">
                Account
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-white/80 hover:text-white transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="glass-button flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-white/80 text-sm">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="glass-button flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="glass-button flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden glass-button p-2"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-white/80 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/search" className="text-white/80 hover:text-white transition-colors">
                Search
              </Link>
              {user && (
                <>
                  <Link to="/account" className="text-white/80 hover:text-white transition-colors">
                    Account
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="text-white/80 hover:text-white transition-colors">
                      Admin
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <SearchBar onClose={() => setIsSearchOpen(false)} />
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </header>
  )
}
