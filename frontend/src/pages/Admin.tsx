import { useState } from 'react'
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings, 
  FileText,
  TrendingUp,
  DollarSign,
  UserPlus
} from 'lucide-react'
import useSWR from 'swr'
import { getAdminStats, getUsers, getContentOverrides, getAdminLogs } from '../services/api'

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const { data: stats } = useSWR('admin-stats', getAdminStats)
  const { data: users } = useSWR('admin-users', () => getUsers())
  const { data: contentOverrides } = useSWR('admin-content', getContentOverrides)
  const { data: logs } = useSWR('admin-logs', () => getAdminLogs())

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <h2 className="text-xl font-heading font-bold text-white mb-6">Admin Panel</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-3" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'users'
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-3" />
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'content'
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-3" />
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'logs'
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-3" />
                  Logs
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-heading font-bold text-white">Dashboard</h3>
                
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/60 text-sm">Total Users</p>
                          <p className="text-2xl font-bold text-white">{stats.stats.totalUsers}</p>
                        </div>
                        <Users className="w-8 h-8 text-primary-400" />
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/60 text-sm">Premium Users</p>
                          <p className="text-2xl font-bold text-white">{stats.stats.premiumUsers}</p>
                        </div>
                        <UserPlus className="w-8 h-8 text-green-400" />
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/60 text-sm">Total Revenue</p>
                          <p className="text-2xl font-bold text-white">${stats.stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-400" />
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/60 text-sm">Total Payments</p>
                          <p className="text-2xl font-bold text-white">{stats.stats.totalPayments}</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                  </div>
                )}

                {stats?.recentPayments && (
                  <div className="glass-card p-6">
                    <h4 className="text-white font-semibold mb-4">Recent Payments</h4>
                    <div className="space-y-3">
                      {stats.recentPayments.slice(0, 5).map((payment: any) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{payment.user.email}</p>
                            <p className="text-white/60 text-sm">{payment.paystackRef}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">${payment.amount}</p>
                            <p className="text-white/60 text-sm">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="glass-card p-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-6">Users</h3>
                {users ? (
                  <div className="space-y-4">
                    {users.users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{user.email}</p>
                          <p className="text-white/60 text-sm">
                            {user.role} • {user.subscriptionStatus} • {user._count.payments} payments
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.subscriptionStatus === 'PREMIUM'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {user.subscriptionStatus}
                          </span>
                          <button className="glass-button text-sm px-3 py-1">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto"></div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <div className="glass-card p-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-6">Content Management</h3>
                {contentOverrides ? (
                  <div className="space-y-4">
                    {contentOverrides.overrides.map((override: any) => (
                      <div key={override.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">TMDB ID: {override.tmdbId}</p>
                          <p className="text-white/60 text-sm">
                            {override.featured ? 'Featured' : 'Not Featured'} • {override.manualCategory || 'No Category'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="glass-button text-sm px-3 py-1">
                            Edit
                          </button>
                          <button className="glass-button text-sm px-3 py-1 bg-red-500/20 border-red-500/30">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto"></div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="glass-card p-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-6">Admin Logs</h3>
                {logs ? (
                  <div className="space-y-4">
                    {logs.logs.map((log: any) => (
                      <div key={log.id} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium">{log.action}</p>
                          <p className="text-white/60 text-sm">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-white/80 text-sm mb-1">
                          Admin: {log.admin.email}
                        </p>
                        {log.detail && (
                          <p className="text-white/60 text-sm">{log.detail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
