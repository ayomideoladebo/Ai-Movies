import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { MovieDetail } from './pages/MovieDetail'
import { TVDetail } from './pages/TVDetail'
import { WatchMovie } from './pages/WatchMovie'
import { WatchTV } from './pages/WatchTV'
import { Search } from './pages/Search'
import { Account } from './pages/Account'
import { Admin } from './pages/Admin'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TVDetail />} />
            <Route path="/watch/movie/:id" element={<WatchMovie />} />
            <Route path="/watch/tv/:id/season/:season/episode/:episode" element={<WatchTV />} />
            <Route path="/search" element={<Search />} />
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
