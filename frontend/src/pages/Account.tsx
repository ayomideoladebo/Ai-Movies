import { useState } from 'react'
import { User, Heart, CreditCard, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { MovieCard } from '../components/MovieCard'
import { TVCard } from '../components/TVCard'

export const Account = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-white/60">Please log in to view your account</p>
        </div>
      </div>
    )
  }

  const watchlist = user.watchlist || []

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">{user.email}</h2>
                  <p className="text-white/60 text-sm capitalize">
                    {user.subscriptionStatus} Plan
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('watchlist')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'watchlist'
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className="w-4 h-4 inline mr-3" />
                  Watchlist ({watchlist.length})
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'subscription'
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CreditCard className="w-4 h-4 inline mr-3" />
                  Subscription
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-3" />
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 inline mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="glass-card p-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-6">Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="glass-input w-full opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Subscription Status
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.subscriptionStatus === 'PREMIUM'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {user.subscriptionStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div className="glass-card p-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-6">
                  My Watchlist ({watchlist.length})
                </h3>
                {watchlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {watchlist.map((item: any) => (
                      <div key={item.id}>
                        {item.media_type === 'movie' ? (
                          <MovieCard movie={item} />
                        ) : (
                          <TVCard tv={item} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-lg mb-2">Your watchlist is empty</p>
                    <p className="text-white/40">
                      Start adding movies and TV shows to your watchlist
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="glass-card p-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-6">Subscription</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-semibold">Current Plan</h4>
                      <p className="text-white/60 capitalize">{user.subscriptionStatus}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {user.subscriptionStatus === 'PREMIUM' ? '$9.99/month' : 'Free'}
                      </p>
                    </div>
                  </div>

                  {user.subscriptionStatus === 'FREE' && (
                    <div className="p-6 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Upgrade to Premium</h4>
                      <p className="text-white/80 mb-4">
                        Get unlimited AI recommendations, priority support, and exclusive content.
                      </p>
                      <button className="glass-button">
                        Upgrade Now
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Plan Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <h5 className="text-white font-medium mb-2">Free Plan</h5>
                        <ul className="text-white/60 text-sm space-y-1">
                          <li>• Basic recommendations</li>
                          <li>• Limited AI chat</li>
                          <li>• Standard quality</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <h5 className="text-white font-medium mb-2">Premium Plan</h5>
                        <ul className="text-white/60 text-sm space-y-1">
                          <li>• Unlimited AI recommendations</li>
                          <li>• Advanced AI chat</li>
                          <li>• High quality streaming</li>
                          <li>• Priority support</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="glass-card p-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-6">Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-4">Preferences</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Email Notifications</p>
                          <p className="text-white/60 text-sm">Get notified about new releases</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Auto-play Trailers</p>
                          <p className="text-white/60 text-sm">Automatically play trailers on hover</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
