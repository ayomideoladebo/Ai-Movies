import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="glass-card border-t border-white/20 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-heading font-bold text-white">MovieApp</span>
            </div>
            <p className="text-white/60 text-sm">
              Discover your next favorite movie with AI-powered recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/60 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-white/60 hover:text-white transition-colors text-sm">
                  Search
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-white/60 hover:text-white transition-colors text-sm">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?genre=action" className="text-white/60 hover:text-white transition-colors text-sm">
                  Action
                </Link>
              </li>
              <li>
                <Link to="/search?genre=comedy" className="text-white/60 hover:text-white transition-colors text-sm">
                  Comedy
                </Link>
              </li>
              <li>
                <Link to="/search?genre=drama" className="text-white/60 hover:text-white transition-colors text-sm">
                  Drama
                </Link>
              </li>
              <li>
                <Link to="/search?genre=horror" className="text-white/60 hover:text-white transition-colors text-sm">
                  Horror
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 MovieApp. All rights reserved. Powered by TMDB and VidFast.
          </p>
        </div>
      </div>
    </footer>
  )
}
