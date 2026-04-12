// App.jsx
// Root component. Sets up React Router and wraps everything in AuthProvider.
// Admin routes are gated behind ProtectedRoute.

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home           from './pages/Home'
import Team           from './pages/Team'
import Projects       from './pages/Projects'
import Events         from './pages/Events'
import Login          from './pages/Login'
import Dashboard      from './pages/admin/Dashboard'
import ManageTeam     from './pages/admin/ManageTeam'
import ManageEvents   from './pages/admin/ManageEvents'
import ManageProjects from './pages/admin/ManageProjects'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/"         element={<Home />}     />
            <Route path="/team"     element={<Team />}     />
            <Route path="/projects" element={<Projects />} />
            <Route path="/events"   element={<Events />}   />
            <Route path="/login"    element={<Login />}    />

            {/* Protected admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/admin/team" element={
              <ProtectedRoute><ManageTeam /></ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute><ManageEvents /></ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute><ManageProjects /></ProtectedRoute>
            } />

            {/* 404 fallback */}
            <Route path="*" element={
              <div style={{
                textAlign: 'center',
                padding: '120px 24px',
                fontFamily: 'var(--font-pixel)',
              }}>
                <p style={{ fontSize: '3rem', marginBottom: 16 }}>💀</p>
                <h1 style={{ fontSize: '1rem', marginBottom: 16 }}>404 — BLOCK NOT FOUND</h1>
                <a href="/" style={{ color: 'var(--grass)', fontSize: '0.5rem' }}>← GO HOME</a>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
