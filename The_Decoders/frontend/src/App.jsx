import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute, {PublicOnlyRoute} from './components/ProtectedRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import EventsPage from './pages/EventsPage.jsx'
import ResourcesPage from './pages/ResourcesPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
// import AnnouncementPopup from './components/AnnouncementPopup.jsx'
import CustomScrollbar from './components/CustomScrollbar'

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      {/* <AnnouncementPopup /> */}
      <BrowserRouter>
      <CustomScrollbar />
        <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/login" element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>  
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App